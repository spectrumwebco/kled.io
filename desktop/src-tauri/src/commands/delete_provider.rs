use tauri::AppHandle;

use super::{
    config::{CommandConfig, DevpodCommandConfig, DevpodCommandError},
    constants::{KLED_BINARY_NAME, KLED_COMMAND_DELETE, KLED_COMMAND_PROVIDER},
};

pub struct DeleteProviderCommand {
    provider_id: String,
}
impl DeleteProviderCommand {
    pub fn new(provider_id: String) -> Self {
        DeleteProviderCommand { provider_id }
    }
}
impl DevpodCommandConfig<()> for DeleteProviderCommand {
    fn config(&self) -> CommandConfig {
        CommandConfig {
            binary_name: KLED_BINARY_NAME,
            args: vec![
                KLED_COMMAND_PROVIDER,
                KLED_COMMAND_DELETE,
                &self.provider_id,
            ],
        }
    }

    fn exec_blocking(self, app_handle: &AppHandle) -> Result<(), DevpodCommandError> {
        let cmd = self.new_command(app_handle)?;

        tauri::async_runtime::block_on(async move { cmd.status().await })
            .map_err(DevpodCommandError::Failed)?
            .success()
            .then_some(())
            .ok_or_else(|| DevpodCommandError::Exit)
    }
}
