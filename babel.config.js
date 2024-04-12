const prodPlugins = []
if (process.env.NODE_ENV === "production") {//只在build去除
	prodPlugins.push("transform-remove-console");
}
module.exports = {
	presets: [
		'@vue/app'
	],
  	plugins: [
      ...prodPlugins
    ]
}
