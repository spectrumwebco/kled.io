// use std::fmt::format;
use std::process::Output;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Shell(#[from] std::io::Error),
    #[error("invalid output from shell echo: {0}")]
    #[allow(dead_code)]
    InvalidOutput(String),
    #[error("failed to run shell echo: {0}")]
    EchoFailed(String),
}

fn get_shell() -> String {
    let default_shell = if cfg!(target_os = "macos") {
        "/bin/zsh"
    } else {
        "/bin/sh"
    };
    return std::env::var("SHELL").unwrap_or_else(|_| default_shell.into());
}

fn read_path_env_cmd(shell: String, var_name: String) -> Result<Output, Error> {
    return std::process::Command::new(shell)
        .arg("-ilc")
        .arg(format!("printenv {}; exit", var_name))
        // Disables Oh My Zsh auto-update thing that can block the process.
        .env("DISABLE_AUTO_UPDATE", "true")
        .output()
        .map_err(Error::Shell);
}

pub fn fix_env(var_name: &str) -> Result<(), Error> {
    #[cfg(windows)]
    {
        return Ok(());
    }
    #[cfg(not(windows))]
    {
        let shell = get_shell();
        let out = read_path_env_cmd(shell, String::from(var_name))?;

        if out.status.success() {
            let stdout = String::from_utf8_lossy(&out.stdout).into_owned();
            let cleaned = &strip_ansi_escapes::strip(stdout)?;
            let value = String::from_utf8_lossy(cleaned);
            std::env::set_var(var_name, value.as_ref());
            Ok(())
        } else {
            Err(Error::EchoFailed(
                String::from_utf8_lossy(&out.stderr).into_owned(),
            ))
        }
    }
}
