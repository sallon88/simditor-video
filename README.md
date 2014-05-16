simditor-video
==============

为simditor增加添加视频按钮, 目前仅支持添加第三方flash视频

插入的视频地址有两种: 一种是swf地址。另外一种是视频的网页地址，这种情况需要自已在后端实现 /getvideo?url=xxx 接口以解析出对应的swf地址, 具体可以参考[getvideo](https://github.com/yeeli/getvideo)
