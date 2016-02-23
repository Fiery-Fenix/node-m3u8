var util = require('util'),
    Item = require('./Item');

var PlaylistItem = module.exports = function PlaylistItem() {
  Item.call(this);
};

util.inherits(PlaylistItem, Item);

PlaylistItem.create = function createPlaylistItem(data) {
  var item = new PlaylistItem();
  item.setData(data);
  return item;
};

PlaylistItem.prototype.toString = function toString() {
  var output = [];
  if (this.get('discontinuity')) {
    output.push('#EXT-X-DISCONTINUITY');
  }
  if (this.get('date')) {
    var date = this.get('date');
    if (date.getMonth) {
      date = date.toISOString();
    }
    output.push('#EXT-X-PROGRAM-DATE-TIME:' + date);
  }
  if (this.get('duration') != null || this.get('title') != null) {
    var duration = this.get('duration') || 0,
        tvgTags = [];

    duration = (duration === -1 || duration === 0) ? duration.toFixed(0) : duration.toFixed(4);
    if (this.get('tvgId') !== null) {
      tvgTags.push('tvg-id="' + this.get('tvgId') + '"');
    }
    if (this.get('tvgName') !== null) {
      tvgTags.push('tvg-name="' + this.get('tvgName') + '"');
    }
    if (this.get('tvgLogo') !== null) {
      tvgTags.push('tvg-logo="' + this.get('tvgLogo') + '"');
    }
    if (this.get('groupTitle') !== null) {
      tvgTags.push('group-title="' + this.get('groupTitle') + '"');
    }

    if (tvgTags.length) {
      duration = duration + ' ' + tvgTags.join(' ');
    }

    output.push(
      '#EXTINF:' + [duration, this.get('title')].join(',')
    );
  }
  if (this.get('group') != null) {
    output.push('#EXTGRP:' + this.get('group'));
  }
  if (this.get('byteRange') != null) {
    output.push('#EXT-X-BYTERANGE:' + this.get('byteRange'));
  }
  output.push(this.get('uri'));

  return output.join('\n');
};
