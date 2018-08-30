describe('uri', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="uriForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="uri" data-fv-uri />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#uriForm').formValidation();

        this.fv   = $('#uriForm').data('formValidation');
        this.$uri = this.fv.getFieldElements('uri');
    });

    afterEach(function() {
        $('#uriForm').formValidation('destroy').remove();
    });

    var validGlobalURIs = [
        'http://foo.com/blah_blah',
        'http://foo.com/blah_blah',
        'http://foo.com/blah_blah/',
        'http://foo.com/blah_blah_(wikipedia)',
        'http://foo.com/blah_blah_(wikipedia)_(again)',
        'http://www.example.com/wpstyle/?p=364',
        'https://www.example.com/foo/?bar=baz&inga=42&quux',
        'http://✪df.ws/123',
        'http://userid:password@example.com:8080',
        'http://userid:password@example.com:8080/',
        'http://userid@example.com',
        'http://userid@example.com/',
        'http://userid@example.com:8080',
        'http://userid@example.com:8080/',
        'http://userid:password@example.com',
        'http://userid:password@example.com/',
        'http://142.42.1.1/',
        'http://142.42.1.1:8080/',
        'http://➡.ws/䨹',
        'http://⌘.ws',
        'http://⌘.ws/',
        'http://foo.com/blah_(wikipedia)#cite-1',
        'http://foo.com/blah_(wikipedia)_blah#cite-1',
        'http://foo.com/unicode_(✪)_in_parens',
        'http://foo.com/(something)?after=parens',
        'http://☺.damowmow.com/',
        'http://code.google.com/events/#&product=browser',
        'http://j.mp',
        'ftp://foo.bar/baz',
        'http://foo.bar/?q=Test%20URL-encoded%20stuff',
        'http://مثال.إختبار',
        'http://例子.测试',
        'http://उदाहरण.परीक्षा',
        "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
        'http://1337.net',
        'http://a.b-c.de',
        'http://223.255.255.254'
    ];

    var validEmptyProtocolURIs = [
        'foo.com/blah_blah',
        'foo.com/blah_blah',
        'foo.com/blah_blah/',
        'foo.com/blah_blah_(wikipedia)',
        'foo.com/blah_blah_(wikipedia)_(again)',
        'www.example.com/wpstyle/?p=364',
        'www.example.com/foo/?bar=baz&inga=42&quux',
        '✪df.ws/123',
        'userid:password@example.com:8080',
        'userid:password@example.com:8080/',
        'userid@example.com',
        'userid@example.com/',
        'userid@example.com:8080',
        'userid@example.com:8080/',
        'userid:password@example.com',
        'userid:password@example.com/',
        '142.42.1.1/',
        '142.42.1.1:8080/',
        '➡.ws/䨹',
        '⌘.ws',
        '⌘.ws/',
        'foo.com/blah_(wikipedia)#cite-1',
        'foo.com/blah_(wikipedia)_blah#cite-1',
        'foo.com/unicode_(✪)_in_parens',
        'foo.com/(something)?after=parens',
        '☺.damowmow.com/',
        'code.google.com/events/#&product=browser',
        'j.mp',
        'foo.bar/baz',
        'foo.bar/?q=Test%20URL-encoded%20stuff',
        '例子.测试',
        'उदाहरण.परीक्षा',
        "-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
        '1337.net',
        'a.b-c.de',
        '223.255.255.254'
    ];

    var invalidEmptyProtocolURIs = [
        'gopher://foo.com/blah_blah',
        'news://foo.com/blah_blah',
        'http:/foo.com/blah_blah/',
        '://foo.com/blah_blah_(wikipedia)',
        'http://http://foo.com/blah_blah_(wikipedia)_(again)'
    ];

    var invalidGlobalURIs = [
        'http://',
        'http://.',
        'http://..',
        'http://../',
        'http://?',
        'http://??',
        'http://??/',
        'http://#',
        'http://##',
        'http://##/',
        'http://foo.bar?q=Spaces should be encoded',
        '//',
        '//a',
        '///a',
        '///',
        'http:///a',
        'foo.com',
        'rdar://1234',
        'h://test',
        'http:// shouldfail.com',
        ':// should fail',
        'http://foo.bar/foo(bar)baz quux',
        'ftps://foo.bar/',
        'http://-error-.invalid/',
        'http://a.b--c.de/',
        'http://-a.b.co',
        'http://a.b-.co',
        'http://.www.foo.bar/',
        'http://www.foo.bar./',
        'http://.www.foo.bar./'
    ];

    var localURIs = [
        'http://intranetsite',
        'http://intranetsite/test',
        'http://intranetsite:80',
        'http://intranetsite:80/test',
        'http://user:pass@intranetsite',
        'http://user:pass@intranetsite/test',
        'http://user:pass@intranetsite:80',
        'http://user:pass@intranetsite:80/test',
        'http://10.1.1.0',
        'http://10.1.1.255',
        'http://10.1.1.1',
        'http://10.1.1.254',
        'http://127.0.0.1',
        'http://192.168.0.1',
        'http://0.0.0.0',
        'http://224.1.1.1',
        'http://1.1.1.1.1',
        'http://123.123.123',
        'http://3628126748'
    ];

    it('Valid URIs (allowLocal=false)', function() {
        var that = this;
        $.each(validGlobalURIs, function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid URIs (allowLocal=false)', function() {
        var that = this;
        $.each(invalidGlobalURIs.concat(localURIs), function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Valid URIs (allowLocal=true)', function() {
        var that = this;
        this.fv.updateOption('uri', 'uri', 'allowLocal', true);
        $.each(validGlobalURIs.concat(localURIs), function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid URIs (allowLocal=true)', function() {
        var that = this;
        this.fv.updateOption('uri', 'uri', 'allowLocal', true);
        $.each(invalidGlobalURIs, function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Valid URIs (allowEmptyProtocol=true)', function() {
        var that = this;
        this.fv.updateOption('uri', 'uri', 'allowEmptyProtocol', true);
        $.each(validGlobalURIs.concat(validEmptyProtocolURIs), function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid URIs (allowEmptyProtocol=true)', function() {
        var that = this;
        this.fv.updateOption('uri', 'uri', 'allowEmptyProtocol', true);
        $.each(invalidEmptyProtocolURIs, function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toBeFalsy();
        });
    });
});
