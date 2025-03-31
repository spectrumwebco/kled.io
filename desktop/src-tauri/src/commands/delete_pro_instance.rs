use tauri::AppHandle;

use super::{
    config::{CommandConfig, DevpodCommandConfig, DevpodCommandError},
    constants::{
        KLED_BINARY_NAME, KLED_COMMAND_DELETE, KLED_COMMAND_PRO, FLAG_IGNORE_NOT_FOUND,
    },
};

pub struct DeleteProInstanceCommand {
    pro_id: String,
}
impl DeleteProInstanceCommand {
    pub fn new(pro_id: String) -> Self {
        DeleteProInstanceCommand { pro_id }
    }
}
impl DevpodCommandConfig<()> for DeleteProInstanceCommand {
    fn config(&self) -> CommandConfig {
        CommandConfig {
            binary_name: KLED_BINARY_NAME,
            args: vec![
                KLED_COMMAND_PRO,
                KLED_COMMAND_DELETE,
                &self.pro_id,
                FLAG_IGNORE_NOT_FOUND,
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
