import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { todotxtBlockProcessor } from './todotxtBlockProcessor';
import { todotxtView } from './todotxtView';

// TODO Remember to rename these classes and interfaces!

// interface MyPluginSettings {
// 	mySetting: string;
// }

// const DEFAULT_SETTINGS: MyPluginSettings = {
// 	mySetting: 'default'
// }

export default class MyPlugin extends Plugin {
	// settings: MyPluginSettings;

	async onload() {
		// await this.loadSettings();

		// TODO 1.0 Parse and render MD
		// TODO 1.1 CSS
		// TODO 1.2 View interactivity (edit/delete,check)
		this.registerEditorExtension([todotxtView]);
		this.registerMarkdownCodeBlockProcessor("todotxt", todotxtBlockProcessor);

		// TODO 2. Settings (defaults)
		
		// TODO 3. Archive file (cron?)

		// TODO x. Suggestor / natural language dates

		// TODO x. Querier (by context and project)

		// TODO x. Rollover

		// TODO x. Import command

		// TODO x. Export as *.txt

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

// 	async loadSettings() {
// 		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
// 	}

// 	async saveSettings() {
// 		await this.saveData(this.settings);
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
}
