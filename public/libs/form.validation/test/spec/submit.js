describe('submit', function() {
    var submitted, originalTimeout;

    FormValidation.Validator.fakeRemote = {
        validate: function(validator, $field, options) {
            var dfd = new $.Deferred();
            setTimeout(function() {
                dfd.resolve($field, 'fakeRemote', { valid: options.valid });
            }, 0);
            return dfd;
        }
    };
    
    beforeEach(function() {
        $([
            '<form id="submitForm" class="form-horizontal" role="form">',
                '<div class="form-group">',
                    '<input name="username" type="text" class="form-control" value="me" required />',
                '</div>',
                '<button id="sendButton" type="submit" class="btn btn-default">Send</button>',
            '</form>'
        ].join('\n')).appendTo('body');

        this.$form = $('#submitForm');
        this.$form
            .formValidation()
            .on('success.form.fv', function(e) {
                e.preventDefault();
                ++submitted;
            })
            .submit(function(e) {
                e.preventDefault();
            });
            
        submitted      = 0;
        this.fv        = this.$form.data('formValidation');
        this.$username = this.fv.getFieldElements('username');

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function() {
        $('#submitForm').formValidation('destroy').remove();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    // #481
    it('without callback nor remote', function(done) {
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(1);
            done();
        }, 0);
    });

    // #481
    it('with callback returning true', function(done) {
        this.fv.addField('username', {
            validators: {
                callback: {
                    message: 'Please enter an username',
                    callback: function(value, validator, $field) {
                        return true;
                    }
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(1);
            done();
        }, 0);
    });

    // #481
    it('with callback returning false', function(done) {
        this.fv.addField('username', {
            validators: {
                callback: {
                    message: 'Please enter an username',
                    callback: function(value, validator, $field) {
                        return false;
                    }
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(0);
            done();
        }, 0);
    });

    // #481
    it('with remote returning true', function(done) {
        this.fv.addField('username', {
            validators: {
                remote: {
                    url: '/test/valid.json',
                    message: 'The username is not available'
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(1);
            done();
        }, 100);
    });

    // #481
    it('with remote returning false', function(done) {
        this.fv.addField('username', {
            validators: {
                remote: {
                    url: '/test/invalid.json',
                    message: 'The username is not available'
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(0);
            done();
        }, 100);
    });

    // #481
    it('with fake remote returning true', function(done) {
        this.fv.addField('username', {
            validators: {
                fakeRemote: {
                    message: 'The username is not available',
                    valid: true
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(1);
            done();
        }, 100);
    });

    // #481
    it('with fake remote returning false', function(done) {
        this.fv.addField('username', {
            validators: {
                fakeRemote: {
                    message: 'The username is not available',
                    valid: false
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(0);
            done();
        }, 100);
    });

    // #1344
    it('remote validator trigger err.form.fv event', function(done) {
        var errorTriggered = 0;

        this.$form
            .on('err.form.fv', function(e) {
                errorTriggered++;
            });

        this.fv.addField('username', {
            validators: {
                remote: {
                    url: '/test/valid.json'
                }
            }
        });

        $('#sendButton').click();
        setTimeout(function() {
            expect(errorTriggered).toBe(0);
            done();
        }, 100);
    });
});
