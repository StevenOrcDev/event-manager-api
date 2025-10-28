# Cette ligne indique la version minimale de Terraform et les providers requis
terraform {
  required_version = ">= 1.0"
  # Cette section définit les providers nécessaires, ici Digital Ocean
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

# Cette ligne permet de configurer le provider Digital Ocean avec le token d'authentification
provider "digitalocean" {
  token = var.do_token
}

# Le VPC est une ressource réseau privée pour isoler les ressources
# Ici, nous créons un VPC pour notre application
resource "digitalocean_vpc" "app_vpc" {
  name   = "${var.environment}-vpc"
  region = var.region
}

# On crée une base de données PostgreSQL sur Digital Ocean
resource "digitalocean_database_cluster" "postgres" {
  name       = "${var.environment}-postgres"
  engine     = "pg"
  version    = "15"
  size       = var.db_size
  region     = var.region
  node_count = 1
  
  private_network_uuid = digitalocean_vpc.app_vpc.id
}

# Base de données - Créer la database
resource "digitalocean_database_db" "app_db" {
  cluster_id = digitalocean_database_cluster.postgres.id
  name       = "event_manager_${var.environment}"
}

# Redis/Valkey (cache)
resource "digitalocean_database_cluster" "valkey" {
  name       = "${var.environment}-valkey"
  engine     = "valkey"
  version    = "8"
  size       = var.cache_size
  region     = var.region
  node_count = 1
  
  # Cette ligne permet de connecter Redis au VPC et donc de sécuriser les échanges. Sans cela Redis serait accessible publiquement.
  # C'est comme si on disait : "Mets Redis dans le réseau privé VPC, pas sur Internet public"
  # private_network_uuid est un argument qui spécifie l'UUID du réseau privé (VPC) auquel la base de données doit être connectée.
  # Pour digita ocean c'est une paramètre attendu pour activer le mode privé
  private_network_uuid = digitalocean_vpc.app_vpc.id
}

# Ici nous créons une Droplet (serveur virtuel) pour héberger notre application Docker
resource "digitalocean_droplet" "app" {
  image    = "docker-20-04"
  name     = "${var.environment}-api"
  region   = var.region
  size     = var.droplet_size
  vpc_uuid = digitalocean_vpc.app_vpc.id

  user_data = templatefile("${path.module}/user_data.sh", {
    docker_image = var.docker_image
    db_host      = digitalocean_database_cluster.postgres.private_host
    db_port      = digitalocean_database_cluster.postgres.port
    db_name      = digitalocean_database_db.app_db.name
    db_user      = digitalocean_database_cluster.postgres.user
    db_password  = digitalocean_database_cluster.postgres.password
    valkey_host   = digitalocean_database_cluster.valkey.private_host
    valkey_port   = digitalocean_database_cluster.valkey.port
    valkey_password = digitalocean_database_cluster.valkey.password
    jwt_secret   = var.jwt_secret
  })

  depends_on = [
    digitalocean_database_cluster.postgres,
    digitalocean_database_cluster.valkey
  ]
}

# Firewall
resource "digitalocean_firewall" "app_firewall" {
  name = "${var.environment}-firewall"

  droplet_ids = [digitalocean_droplet.app.id]

  # SSH (pour administration)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTP
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # API (port 3000)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "3000"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Tout sortant autorisé
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# Outputs
output "app_ip" {
  description = "IP publique du serveur"
  value       = digitalocean_droplet.app.ipv4_address
}

output "app_url" {
  description = "URL de l'application"
  value       = "http://${digitalocean_droplet.app.ipv4_address}:3000"
}

output "postgres_host" {
  description = "Hôte PostgreSQL"
  value       = digitalocean_database_cluster.postgres.host
  sensitive   = true
}

output "valkey_host" {
  description = "Hôte Valkey (compatible Redis)"
  value       = digitalocean_database_cluster.valkey.host
  sensitive   = true
}