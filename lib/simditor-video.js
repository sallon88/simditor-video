(function() {
  var VideoButton, VideoPopover,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  VideoButton = (function(_super) {
    __extends(VideoButton, _super);

    function VideoButton() {
      return VideoButton.__super__.constructor.apply(this, arguments);
    }

    VideoButton.prototype._videoTpl = '<p><embed allowFullScreen="true" quality="high" width="620" height="500" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" src="---video-src---"></embed></p>';

    VideoButton.prototype.name = 'video';

    VideoButton.prototype.icon = 'video-camera';

    VideoButton.prototype.title = '插入视频';

    VideoButton.prototype.htmlTag = 'embed';

    VideoButton.prototype.disableTag = 'pre, table';

    VideoButton.prototype.setupVideoConfig = function() {
      this.editor.formatter._allowedTags.push('embed');
      this.editor.formatter._allowedAttributes['embed'] = ['allowfullscreen', 'id', 'quality', 'width', 'height', 'align', 'src', 'type'];
      return this.editor.sync = (function(_this) {
        return function() {
          var children, cloneBody, emptyP, firstP, lastP, val;
          cloneBody = _this.editor.body.clone();
          _this.editor.formatter.undecorate(cloneBody);
          _this.editor.formatter.format(cloneBody);
          _this.editor.formatter.autolink(cloneBody);
          children = cloneBody.children();
          lastP = children.last('p');
          firstP = children.first('p');
          while (lastP.is('p') && !lastP.text() && !lastP.find('img').length && !lastP.find('embed').length) {
            emptyP = lastP;
            lastP = lastP.prev('p');
            emptyP.remove();
          }
          while (firstP.is('p') && !firstP.text() && !firstP.find('img').length && !firstP.find('embed').length) {
            emptyP = firstP;
            firstP = lastP.next('p');
            emptyP.remove();
          }
          val = $.trim(cloneBody.html());
          _this.editor.textarea.val(val);
          return val;
        };
      })(this);
    };

    VideoButton.prototype.render = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      VideoButton.__super__.render.apply(this, args);
      this.setupVideoConfig();
      return this.popover = new VideoPopover(this);
    };

    VideoButton.prototype.parseVideoSrc = function(src) {
      var videoSrc;
      videoSrc = false;
      if (src && src.match(/\.swf\b/)) {
        videoSrc = src;
      } else if (src) {
        $.ajax({
          url: "/getvideo?url=" + (encodeURIComponent(src)),
          dataType: 'json',
          async: false,
          type: 'GET',
          success: function(data) {
            if (data.flash.length > 0) {
              return videoSrc = data.flash;
            }
          }
        });
      }
      return videoSrc;
    };

    VideoButton.prototype.loadVideo = function(src, target) {
      var videoNode, videoSrc;
      videoSrc = this.parseVideoSrc(src);
      if (!videoSrc) {
        return;
      }
      videoNode = $(this._videoTpl.replace('---video-src---', videoSrc));
      target.after(videoNode);
      return this.editor.trigger('valuechanged');
    };

    VideoButton.prototype.command = function() {
      var $breakedEl, $endBlock, $startBlock, endNode, popoverTarget, range, startNode;
      range = this.editor.selection.getRange();
      startNode = range.startContainer;
      endNode = range.endContainer;
      $startBlock = this.editor.util.closestBlockEl(startNode);
      $endBlock = this.editor.util.closestBlockEl(endNode);
      range.deleteContents();
      if ($startBlock[0] === $endBlock[0]) {
        if ($startBlock.is('li')) {
          $startBlock = this.editor.util.furthestNode($startBlock, 'ul, ol');
          $endBlock = $startBlock;
          range.setEndAfter($startBlock[0]);
          range.collapse(false);
        } else if ($startBlock.is('p')) {
          if (this.editor.util.isEmptyNode($startBlock)) {
            range.selectNode($startBlock[0]);
            range.deleteContents();
          } else if (this.editor.selection.rangeAtEndOf($startBlock, range)) {
            range.setEndAfter($startBlock[0]);
            range.collapse(false);
          } else if (this.editor.selection.rangeAtStartOf($startBlock, range)) {
            range.setEndBefore($startBlock[0]);
            range.collapse(false);
          } else {
            $breakedEl = this.editor.selection.breakBlockEl($startBlock, range);
            range.setEndBefore($breakedEl[0]);
            range.collapse(false);
          }
        }
      }
      popoverTarget = $('</p>');
      this.editor.selection.insertNode(popoverTarget, range);
      return this.popover.show(popoverTarget);
    };

    return VideoButton;

  })(SimditorButton);

  Simditor.Toolbar.addButton(VideoButton);

  VideoPopover = (function(_super) {
    __extends(VideoPopover, _super);

    VideoPopover.prototype._tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>视频地址</label>\n    <input class=\"video-src\" type=\"text\"/>\n    </a>\n  </div>\n</div>";

    function VideoPopover(button) {
      this.button = button;
      VideoPopover.__super__.constructor.call(this, this.button.editor);
    }

    VideoPopover.prototype.render = function() {
      this.el.addClass('video-popover').append(this._tpl);
      this.srcEl = this.el.find('.video-src');
      this.srcEl.on('keydown', (function(_this) {
        return function(e) {
          if (e.which === 13) {
            e.preventDefault();
            _this.button.loadVideo(_this.srcEl.val(), _this.target);
            return _this.srcEl.blur();
          }
        };
      })(this));
      return this.srcEl.on('blur', (function(_this) {
        return function() {
          _this.target.remove();
          return _this.hide();
        };
      })(this));
    };

    VideoPopover.prototype.show = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      VideoPopover.__super__.show.apply(this, args);
      this.srcEl.val('');
      return this.srcEl.focus();
    };

    return VideoPopover;

  })(SimditorPopover);

}).call(this);
