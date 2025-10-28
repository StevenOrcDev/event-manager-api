bucket                      = "event-manager-tfstate"
key                         = "production/terraform.tfstate"
region                      = "us-east-1"
endpoints                   = { s3 = "https://fra1.digitaloceanspaces.com"}
skip_credentials_validation = true
skip_requesting_account_id  = true
skip_metadata_api_check     = true
use_path_style              = true

# HCL (HashiCorp Configuration Language) est le langage de configuration créé par HashiCorp (la société derrière Terraform, Vault, Consul, etc.).

# Terraform à besoin d'un endroit pour stocker l'état de l'infrastructure qu'il gère.
# Cet état est crucial car il permet à Terraform de savoir quelles ressources existent déjà, leurs configurations actuelles, et comment elles sont liées entre elles.
# En utilisant un backend distant comme un bucket S3 (ou dans ce cas DigitalOcean Spaces qui est compatible S3),
# plusieurs membres d'une équipe peuvent collaborer sur la même infrastructure sans écraser les modifications des autres.
# De plus, un backend distant offre des avantages supplémentaires tels que la sécurité, la sauvegarde automatique de l'état
# et la possibilité de verrouiller l'état pour éviter les conflits lors des modifications simultanées.

# S3 = Simple Storage Service, un service de stockage d'objets proposé par Amazon Web Services (AWS).

# C’est un service où tu peux stocker des fichiers (objets) dans des buckets (des conteneurs de fichiers).
# Il est :

# hautement scalable (peut contenir des millions de fichiers),

# sécurisé (permissions, chiffrement),

# et accessible par API (HTTP REST, SDK, Terraform, etc.).

# Exemple concret :

# Tu peux utiliser un bucket S3 pour stocker ton fichier terraform.tfstate, des images de ton site, des logs, des backups, etc.