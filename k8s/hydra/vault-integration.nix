{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    vault
  ];
  
  systemd.services.hydra-vault-auth = {
    description = "Hydra Vault Authentication";
    wantedBy = [ "multi-user.target" ];
    after = [ "network.target" "vault.service" ];
    path = [ pkgs.vault ];
    script = ''
      vault login -method=kubernetes \
        role=hydra \
        jwt_path=/var/run/secrets/kubernetes.io/serviceaccount/token
    '';
    serviceConfig = {
      Type = "oneshot";
      RemainAfterExit = true;
      User = "hydra";
      Group = "hydra";
    };
  };
}
