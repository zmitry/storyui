export function event(name: string) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    var event = new CustomEvent("track", {
      detail: {
        name: name,
        args: args
      }
    });
    if (window.parent) {
      window.parent.document.body.dispatchEvent(event);
    } else {
      document.body.dispatchEvent(event);
    }
  };
}
