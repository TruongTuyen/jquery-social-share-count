(function($) {
    $.fn.shareCount = function(options) {
        var settings = $.extend({
            twitter: false,
            facebook: false,
            linkedin: false,
            pinterest: false,
            google: false,
            template: '<span class="share-number">{number}</span>'
        }, options);
        function replace_number(str, number) {
            str.replace('{number}', number);
            return str;
        }
        return this.each(function() {
            var _that = this;
            var url = 'http://facebook.com';
            if (settings.twitter) {
                jQuery.getJSON('http://public.newsharecounts.com/count.json?url=' + url, function(data) {
                    $(_that).find(settings.twitter).append(settings.template.replace('{number}', data.count));
                });
            }
            if (settings.facebook) {
                jQuery.getJSON('http://graph.facebook.com/' + url, function(data) {
                    var share_number = data.share.share_count;
                    $(_that).find(settings.facebook).append(settings.template.replace('{number}', share_number));
                });
            }
            if (settings.linkedin) {
                $.ajax({
                    url: 'https://www.linkedin.com/countserv/count/share?url=' + url,
                    type: 'GET',
                    contentType: "application/json",
                    dataType: 'jsonp',
                    success: function(data) {
                        $(_that).find(settings.linkedin).append(settings.template.replace('{number}', data.count));
                    },
                });
            }
            if (settings.pinterest) {
                $.getJSON("http://api.pinterest.com/v1/urls/count.json?callback=?&url=" + url, function(data) {
                    $(_that).find(settings.pinterest).append(settings.template.replace('{number}', data.count));
                });
            }
            if (settings.google) {
                $.ajax({
                    type: 'POST',
                    url: 'https://clients6.google.com/rpc',
                    processData: true,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'method': 'pos.plusones.get',
                        'id': url,
                        'params': {
                            'nolog': true,
                            'id': url,
                            'source': 'widget',
                            'userId': '@viewer',
                            'groupId': '@self'
                        },
                        'jsonrpc': '2.0',
                        'key': 'p',
                        'apiVersion': 'v1'
                    }),
                    success: function(response) {
                        $(_that).find(settings.google).append(settings.template.replace('{number}', response.result.metadata.globalCounts.count));
                    }
                });
            }
        });
    }
}(jQuery));
