import { MarkdownPostProcessorContext } from 'obsidian';
import { LanguageLine, TodoList, TodoItem } from './model';
import { notice, Level } from './notice';

// line 0 is langLine
export const UNSAVED_ITEMS: { listId: string; line: number; newText?: string }[] = [];

export function todotxtBlockProcessor(
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
) {
	// Parse language line.
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const info = ctx.getSectionInfo(el)!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const languageLine = info.text.split('\n', info.lineStart + 1).last()!;
	const { langLine, errors: errs } = LanguageLine.from(languageLine);
	if (errs.length) {
		let errMsg = '';
		errs.forEach((e) => (errMsg += `- ${e.message}\n`));
		notice(errMsg, Level.ERR, 15000);
	}

	// Create todo list and update editor state.
	const items = source
		.split('\n')
		.filter((line) => line.trim().length)
		.map((line) => new TodoItem(line));
	const todoList = new TodoList(langLine, items);

	const newLangLine = langLine.toString();
	if (languageLine !== newLangLine) {
		UNSAVED_ITEMS.push({ listId: todoList.getId(), line: 0, newText: newLangLine });
	}

	const lines = source.split('\n');
	for (const [i, line] of lines.entries()) {
		const newItem = todoList.items.at(i)?.toString();
		if (newItem) {
			if (line !== newItem) {
				UNSAVED_ITEMS.push({ listId: todoList.getId(), line: i + 1, newText: newItem });
			}
		} else if (lines.length > 1) {
			UNSAVED_ITEMS.push({ listId: todoList.getId(), line: i + 1 });
		}
	}

	// Render todo list.
	el.appendChild(todoList.render());
}
