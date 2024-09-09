import { v4 as randomUUID } from 'uuid';
import { ActionType, TodoItem, TodoList } from '.';
import type { ViewModel } from '.';
import { AddItemModal } from 'src/component';
import { ActionButtonV2 } from './ActionButtonV2';
import { update } from 'src/stateEditor';

export default class ProjectGroupContainer implements ViewModel {
	static HTML_CLS = 'project-group-container';
	static LIST_CLS = 'project-group-list';
	static CHECKBOX_CLS = 'project-group-checkbox';

	private _id: string;
	items: TodoItem[];
	name: string;
	isCollapsed: boolean;
	isCompleted: boolean;

	constructor(name: string, items: TodoItem[], isCollapsed: boolean) {
		this.name = name;
		this.items = items;
		this.isCollapsed = isCollapsed;
		this.isCompleted = this.items.every((item) => item.complete());
	}

	render(): HTMLElement {
		const container = document.createElement('div');
		container.addClass(this.getHtmlCls());
		if (this.isCompleted) {
			container.setAttr('completed', true);
		}

		const checkboxId = randomUUID();
		const checkbox = container.createEl('input', {
			type: 'checkbox',
			cls: ProjectGroupContainer.CHECKBOX_CLS,
		});
		checkbox.id = checkboxId;
		checkbox.setAttr(!this.isCollapsed ? 'checked' : 'unchecked', true);
		const label = container
			.createEl('label', {
				attr: { for: checkboxId },
			});
		label.setText(`+${this.name} (${this.items.filter(i => i.complete()).length}/${this.items.length})`)
		label.addEventListener('click', e => {
			const todoListEl = container.matchParent('.' + TodoList.HTML_CLS)!;
			this.toggleProjectCollapse(label as HTMLLabelElement, todoListEl);
		});

		//
		const addBtn = new ActionButtonV2(ActionType.ADD, this._id).render();
		addBtn.addEventListener('click', e => {
			const todoListEl = container.matchParent('.' + TodoList.HTML_CLS)!;
			this.addProjectItem(todoListEl);
			if (checkbox.checked) {
				e.stopPropagation();
				e.preventDefault();
			}
		});
		label.append(addBtn);

		const list = container.createDiv({
			cls: ProjectGroupContainer.LIST_CLS,
		});
		this.items.forEach((item) => list.appendChild(item.render()));

		return container;
	}

	getId(): string {
		return this._id;
	}

	getHtmlCls(): string {
		return ProjectGroupContainer.HTML_CLS;
	}

	private addProjectItem(todoListEl: Element) {
		const addModal = new AddItemModal(todoListEl,
			(result) => {
				const { todoList, from, to } = TodoList.from(todoListEl);
				todoList.add(result);
				update(from, to, todoList);
			});
		addModal.open();

		// No idea why this happens when selectionEnd is set to 0,
		// but this is a hack to re-focus on the inputEl
		const refocus = (e: Event) => {
			e.preventDefault();
			addModal.textComponent.inputEl.focus();
			addModal.textComponent.inputEl.removeEventListener('blur', refocus);
		};
		addModal.textComponent.inputEl.addEventListener('blur', refocus);

		addModal.persistInput(` +${this.name}`, 0);
	}

	private toggleProjectCollapse(label: HTMLLabelElement, todoListEl: Element) {
		const { todoList, from, to } = TodoList.from(todoListEl);
		const project = /\+(\S+)/.exec(label.getText())![1];

		const langLine = todoList.languageLine();
		if (langLine.collapsedProjectGroups.has(project)) {
			langLine.collapsedProjectGroups.delete(project);
		} else {
			langLine.collapsedProjectGroups.add(project);
		}

		const newList = new TodoList(langLine, todoList.items());
		update(from, to, newList);
	}
}
