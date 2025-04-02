{ nixpkgs ? <nixpkgs> }:

let
  pkgs = import nixpkgs {};
  
  buildKledCLI = { name, src, goPackagePath }: pkgs.buildGoModule {
    pname = name;
    version = "0.1.0";
    inherit src;
    
    vendorSha256 = null; # Set this to the actual hash after initial build
    
    nativeBuildInputs = [ pkgs.installShellFiles ];
    
    postInstall = ''
      installShellCompletion --cmd ${name} \
        --bash <($out/bin/${name} completion bash) \
        --zsh <($out/bin/${name} completion zsh)
    '';
    
    meta = with pkgs.lib; {
      description = "Kled CLI for Kubernetes workspace management";
      homepage = "https://kled.io";
      license = licenses.mit;
      maintainers = [ "Spectrum Web Co" ];
    };
  };
in {
  kled = buildKledCLI {
    name = "kled";
    src = ./.;
    goPackagePath = "github.com/spectrumwebco/kled";
  };
}
