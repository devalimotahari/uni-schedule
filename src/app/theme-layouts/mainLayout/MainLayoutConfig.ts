/**
 * The MainLayout Config object.
 */
const MainLayoutConfig = {
	title: 'Main Layout',
	defaults: {
		mode: 'container',
		containerWidth: 1570,
		navbar: {
			display: true,
			folded: true,
			style: 'fixed',
			position: 'left',
			open: true
		},
		toolbar: {
			display: true,
			style: 'fixed'
		},
		footer: {
			display: false,
			style: 'fixed'
		},
		leftSidePanel: {
			display: true
		},
		rightSidePanel: {
			display: true
		}
	},
	form: {
		mode: {
			title: 'Mode',
			type: 'radio',
			options: [
				{
					name: 'Boxed',
					value: 'boxed'
				},
				{
					name: 'Full Width',
					value: 'fullwidth'
				},
				{
					name: 'Container',
					value: 'container'
				}
			]
		},
		containerWidth: {
			title: 'Container Width (px)',
			type: 'number'
		},

		navbar: {
			type: 'group',
			title: 'Navbar',
			children: {
				display: {
					title: 'Display',
					type: 'switch'
				},
				position: {
					title: 'Position',
					type: 'radio',
					options: [
						{
							name: 'Left',
							value: 'left'
						},
						{
							name: 'Right',
							value: 'right'
						}
					]
				},
				folded: {
					title: 'Folded (style-2, style-3)',
					type: 'switch'
				}
			}
		},
		toolbar: {
			type: 'group',
			title: 'Toolbar',
			children: {
				display: {
					title: 'Display',
					type: 'switch'
				},
				style: {
					title: 'Style',
					type: 'radio',
					options: [
						{
							name: 'Fixed',
							value: 'fixed'
						},
						{
							name: 'Static',
							value: 'static'
						}
					]
				}
			}
		},
		footer: {
			type: 'group',
			title: 'Footer',
			children: {
				display: {
					title: 'Display',
					type: 'switch'
				},
				style: {
					title: 'Style',
					type: 'radio',
					options: [
						{
							name: 'Fixed',
							value: 'fixed'
						},
						{
							name: 'Static',
							value: 'static'
						}
					]
				}
			}
		}
	}
};

export type MainLayoutConfigDefaultsType = (typeof MainLayoutConfig)['defaults'];

export default MainLayoutConfig;
