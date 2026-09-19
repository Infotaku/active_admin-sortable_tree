document.addEventListener("DOMContentLoaded", () => {
  const sortableEvent = window.ActiveAdminSortableEvent || {};

  const trigger = (eventName, args) => {
    if (sortableEvent.trigger) {
      sortableEvent.trigger(eventName, args);
    }
  };

  const refreshAlternatingRows = ($el) => {
    $el.find(".item").each((index, item) => {
      const $item = window.jQuery(item);
      if (index % 2 === 0) {
        $item.removeClass("even").addClass("odd");
      } else {
        $item.removeClass("odd").addClass("even");
      }
    });
  };

  window.ActiveAdminSortableEvent = window.ActiveAdminSortableEvent || {
    add(event, callback) {
      if (!this._listeners) this._listeners = {};
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(callback);
    },
    trigger(event, args) {
      if (!this._listeners || !this._listeners[event]) return;
      this._listeners[event].forEach((callback) => {
        try {
          callback.call(null, args);
        } catch (error) {
          if (window.console && typeof window.console.error === "function") {
            window.console.error(error);
          }
        }
      });
    }
  };

  const $ = window.jQuery;
  if (!$) return;

  $(".disclose").on("click", function (event) {
    event.preventDefault();
    $(this).closest("li").toggleClass("mjs-nestedSortable-collapsed").toggleClass("mjs-nestedSortable-expanded");
  });

  $(".index_as_sortable [data-sortable-type]").each(function () {
    const $this = $(this);
    const sortableType = $this.data("sortable-type");
    const maxLevels = sortableType === "tree" ? $this.data("max-levels") : 1;
    const tabHack = sortableType === "tree" ? 20 : 99999;

    $this.nestedSortable({
      forcePlaceholderSize: true,
      forceHelperSizeType: true,
      errorClass: "cantdoit",
      disableNesting: "cantdoit",
      handle: "> .item",
      listType: "ol",
      items: "li",
      opacity: 0.6,
      placeholder: "placeholder",
      revert: 250,
      maxLevels,
      tabSize: tabHack,
      protectRoot: $this.data("protect-root"),
      tolerance: "pointer",
      toleranceElement: "> div",
      isTree: true,
      startCollapsed: $this.data("start-collapsed"),
      update() {
        $this.nestedSortable("disable");
        $.ajax({
          url: $this.data("sortable-url"),
          type: "post",
          data: $this.nestedSortable("serialize")
        }).always(() => {
          refreshAlternatingRows($this);
          $this.nestedSortable("enable");
          trigger("ajaxAlways");
        }).done(() => {
          trigger("ajaxDone");
        }).fail(() => {
          trigger("ajaxFail");
        });
      }
    });
  });
});
