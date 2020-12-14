with (import <nixpkgs> {});

mkShell {
    buildInputs = [
        nodejs
				nodePackages.gulp
        yarn
        git
    ];
}
