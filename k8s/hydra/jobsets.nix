{ nixpkgs ? <nixpkgs> }:

let
  pkgs = import nixpkgs {};
in {
  jobsets = pkgs.runCommand "jobsets.json" {} ''
    cat > $out <<EOF
    {
      "kled-cli": {
        "enabled": 1,
        "hidden": false,
        "description": "Kled CLI builds",
        "nixexprinput": "kled",
        "nixexprpath": "release.nix",
        "checkinterval": 300,
        "schedulingshares": 100,
        "enableemail": true,
        "emailoverride": "",
        "keepnr": 3,
        "inputs": {
          "kled": { "type": "git", "value": "https://github.com/spectrumwebco/kled.git main", "emailresponsible": false },
          "nixpkgs": { "type": "git", "value": "https://github.com/NixOS/nixpkgs.git nixos-23.05", "emailresponsible": false }
        }
      },
      "kled-pro-cli": {
        "enabled": 1,
        "hidden": false,
        "description": "Kled Pro CLI builds",
        "nixexprinput": "kled-pro",
        "nixexprpath": "release.nix",
        "checkinterval": 300,
        "schedulingshares": 100,
        "enableemail": true,
        "emailoverride": "",
        "keepnr": 3,
        "inputs": {
          "kled-pro": { "type": "git", "value": "https://github.com/spectrumwebco/kled-pro.git main", "emailresponsible": false },
          "nixpkgs": { "type": "git", "value": "https://github.com/NixOS/nixpkgs.git nixos-23.05", "emailresponsible": false }
        }
      }
    }
    EOF
  '';
}
