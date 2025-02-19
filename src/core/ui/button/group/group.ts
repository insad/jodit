/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/button
 */

import './group.less';

import type {
	IDictionary,
	IUIButton,
	IUIOption,
	IViewBased
} from '../../../../types';
import { UIGroup } from '../../group';
import { component } from '../../../decorators';
import { UIButton } from '../button/button';

@component
export class UIButtonGroup extends UIGroup {
	override elements!: IUIButton[];

	/** @override */
	override className(): string {
		return 'UIButtonGroup';
	}

	/** @override */
	protected override render(options: IDictionary): string {
		return `<div>
			<div class="&__label">~${options.label}~</div>
			<div class="&__options"></div>
		</div>`;
	}

	/** @override */
	protected override appendChildToContainer(
		childContainer: HTMLElement
	): void {
		this.getElm('options').appendChild(childContainer);
	}

	constructor(
		jodit: IViewBased,
		override readonly options: {
			name?: string;
			value?: string | boolean | number;
			label?: string;
			onChange?: (values: IUIOption[]) => void;
			options?: IUIOption[];
			radio: boolean;
		} = {
			radio: true
		}
	) {
		super(
			jodit,
			options.options?.map(opt => {
				const btn = new UIButton(jodit, {
					text: opt.text,
					value: opt.value,
					variant: 'primary'
				});

				btn.onAction(() => {
					this.select(opt.value);
				});

				return btn;
			}),
			options
		);

		this.select(options.value ?? 0);
	}

	protected select(indexOrValue: IUIOption['value'] | number): void {
		this.elements.forEach((elm, index) => {
			if (index === indexOrValue || elm.state.value === indexOrValue) {
				elm.state.activated = true;
			} else if (this.options.radio) {
				elm.state.activated = false;
			}
		});

		const result = this.elements
			.filter(elm => elm.state.activated)
			.map(elm => ({
				text: elm.state.text,
				value: elm.state.value
			}));

		this.jodit.e.fire(this, 'select', result);

		this.options.onChange?.(result);
	}
}
