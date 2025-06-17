function wrapContents(selection, wrapperClass) {
  selection.each(function() {
    item = d3.select(this);
    var wrapper = item.append("div").attr('class', wrapperClass);
    item.selectAll(':scope > :not(.' + wrapperClass + ')').each(function() {
      wrapper.node().appendChild(this);
    });
  });

}