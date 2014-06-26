simditor-video
==============

[Simditor](http://simditor.tower.im/)扩展，允行在内容中添加第三方flash视频

### 如何使用
在Simditor的基础上额外引用simditor-video的脚本

```html
<script src="/assets/javascripts/simditor-video.js"></script>
```

配置

```javascript
new Simditor({
    textarea: textareaElement,
    ...,
    toolbar: [..., 'video']
})
```

点击添加视频按钮后，在弹出的地址框中输入视频地址，回车即可完成添加视频

视频地址类型

1. flash地址，即swf地址
2. 网页地址, 使用此类地址时需要后端实现一个getvideo接口,以将网页地址转换为flash地址, 可参考[getvideo](https://github.com/yeeli/getvideo)

接口格式

- 请求: /getvideo?url=:page_url
- 返回: { flash: :swf_url }

其中 :page_url为输入的网页地址, :swf_url为解析后的swf地址
