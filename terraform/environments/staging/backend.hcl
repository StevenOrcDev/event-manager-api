bucket                      = "event-manager-tfstate"
key                         = "production/terraform.tfstate"
region                      = "us-east-1"
endpoints                   = { s3 = "https://fra1.digitaloceanspaces.com"}
skip_credentials_validation = true
skip_requesting_account_id  = true
skip_metadata_api_check     = true
use_path_style              = true