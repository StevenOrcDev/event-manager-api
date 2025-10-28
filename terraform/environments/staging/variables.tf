variable "do_token" {
  description = "Token Digital Ocean"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environnement (staging)"
  type        = string
  default     = "staging"
}

variable "region" {
  description = "Région Digital Ocean"
  type        = string
  default     = "fra1"
}

variable "docker_image" {
  description = "Image Docker à déployer"
  type        = string
  default     = "stevenorc/event-manager-api:latest"
}

variable "jwt_secret" {
  description = "Secret JWT"
  type        = string
  sensitive   = true
}

variable "droplet_size" {
  description = "Taille du Droplet"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "db_size" {
  description = "Taille de la base PostgreSQL"
  type        = string
  default     = "db-s-1vcpu-1gb"
}

variable "cache_size" {
  description = "Taille du cache Valkey"
  type        = string
  default     = "db-s-1vcpu-1gb"
}
