{ config, pkgs, ... }:

{
  services.hydra = {
    enable = true;
    hydraURL = "https://hydra.kled.io";
    notificationSender = "hydra@kled.io";
    buildMachinesFiles = [];
    useSubstitutes = true;
  };

  services.postgresql = {
    enable = true;
    package = pkgs.postgresql_11;
    extraConfig = ''
      max_connections = 250
      work_mem = 32MB
      shared_buffers = 512MB
    '';
  };

  networking.firewall.allowedTCPPorts = [ 80 443 3000 ];

  security.acme = {
    email = "admin@kled.io";
    acceptTerms = true;
  };

  services.nginx = {
    enable = true;
    virtualHosts."hydra.kled.io" = {
      forceSSL = true;
      enableACME = true;
      locations."/".proxyPass = "http://127.0.0.1:3000";
    };
  };
}
