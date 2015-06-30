({
	appDir: './',
	baseUrl: './',
	dir: './min',
	paths: {
		base: 'core/base',
		dialog: 'widget/dialog/dialog',
		all: 'public/all',
		doc: 'public/zhdoc',
		css: 'core/css.min',
		text: 'core/text'
	},
	fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
	removeCombined: true,
	modules: [
		{
			name: 'module/loanList/loanList'
		}	
	]
})