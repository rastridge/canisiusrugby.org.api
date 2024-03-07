in ./node_modules/vue2-editor/dist/vue2-editor.esm.js 

Line #868

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
	var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	return _c('div',{staticClass:"quillWrapper"},[_vm._t("toolbar"),_vm._v(" "),_c('div',{ref:"quillContainer",attrs:{"id":_vm.id}}),_vm._v(" "),_vm._e()],2)};
var __vue_staticRenderFns__ = [];


Line #715

    customImageHandler: function customImageHandler(image, callback) {
			var _vm=this
			_vm.emitImageInfo()
    },
    emitImageInfo: function emitImageInfo() {
      var Editor = this.quill;
      var range = Editor.getSelection();
      var cursorLocation = range.index;
      this.$emit("image-added", Editor, cursorLocation);
    }
    
    Remove references to file, ?? in calling scripts
