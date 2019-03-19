export class CreativeValidations {

    static handleBannerCreativeUpload() {
        $('#submitBannerCreativeForm').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    bannerCreativeName: {
                        required: true,
                    },
                    bannerImage: {
                        required: true,
                        extension: "jpg,jpeg,png,gif"
                    },
                    bannerCreativeURL: {
                        required: true,
                    }
                },
                messages: {
                    bannerCreativeName: {
                        required: "Please enter creative name",
                    },
                    bannerImage: {
                        required: "Please upload creative image",
                        extension: "Invalid file extension, Upload image having jpg, jpeg,png,gif extension"
                    },
                    bannerCreativeURL: {
                        required: "Please enter click url",
                    }
                }
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    static handleRichmediaCreativeUpload() {

        $('#submitRichmediaCreative').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    richmediaCreativeName: {
                        required: true,
                    },
                    richmediaCreativeCode: {
                        required: true,

                    },
                    richMediaCreativePreview: {
                        required: true,
                        extension: "jpg,jpeg,png,gif"
                    },
                    richmediaCreativeWidth: {
                        required: true,
                    },
                    richmediaCreativeHeight: {
                        required: true,
                    },
                    richmediaClickURL: {
                        required: true,
                    }
                },
                messages: {
                    richmediaCreativeName: {
                        required: "Please enter creative name",
                    },
                    richMediaCreativePreview: {
                        required: "Please upload creative image",
                        extension: "Invalid file extension, Upload image having jpg, jpeg,png,gif extension"
                    },
                    richmediaCreativeCode: {
                        required: "Please enter richmedia creative HTML/JS code",
                    },
                    richmediaCreativeWidth: {
                        required: "Please enter creative width",
                    },
                    richmediaCreativeHeight: {
                        required: "Please enter creative height",
                    },
                    richmediaClickURL: {
                        required: "Please enter click url",
                    }
                }
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }


    static handleNativeCreativeUpload() {

        $('#submitNativeCreative').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    nativeCreativeName: {
                        required: true
                    },
                    nativeCreativeTitle: {
                        required: true
                    },
                    nativeCreativeDescription: {
                        required: true
                    },
                    nativeCreativeMainPreview: {
                        required: true,
                        extension: "jpg,jpeg,png,gif"
                    },
                    nativeCreativeIcon: {
                        required: true,
                        extension: "jpg,jpeg,png,gif"
                    },
                    nativeCreativeURL: {
                        required: true
                    },
                    nativeCreativeRating: {
                        required: true
                    },
                    nativeCalltoAction: {
                        required: true
                    }
                },
                messages: {
                    nativeCreativeName: {
                        required: "Please enter creative name"
                    },
                    nativeCreativeTitle: {
                        required: "Please enter creative title"
                    },
                    nativeCreativeDescription: {
                        required: "Please enter description"
                    },
                    nativeCreativeMainPreview: {
                        required: "Please upload creative main image",
                        extension: "Invalid file extension, Upload image having jpg, jpeg,png,gif extension"
                    },
                    nativeCreativeIcon: {
                        required: "Please upload creative icon",
                        extension: "Invalid file extension, Upload image having jpg, jpeg,png,gif extension"
                    },
                    nativeCreativeURL: {
                        required: "Please enter click url"
                    },
                    nativeCreativeRating: {
                        required: "Please enter rating"
                    },
                    nativeCalltoAction: {
                        required: "Please enter call to action text"
                    },
                    richmediaClickURL: {
                        required: "Please enter click url"
                    }
                }
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    static handleBannerCreativeUploadEdit() {
        $('#submitBannerCreativeFormEdit').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    bannerCreativeName: {
                        required: true,
                    },
                    bannerImage: {
                        extension: "jpg,jpeg,png,gif"
                    },
                    bannerCreativeURL: {
                        required: true,
                    }
                },
                messages: {
                    bannerCreativeName: {
                        required: "Please enter creative name",
                    },
                    bannerImage: {
                        required: "Please upload creative image",
                        extension: "Invalid file extension, Upload image having jpg, jpeg,png,gif extension"
                    },
                    bannerCreativeURL: {
                        required: "Please enter click url",
                    }
                }
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    static handleRichmediaCreativeUploadEdit() {

        $('#submitRichmediaCreativeEdit').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    richmediaCreativeName: {
                        required: true,
                    },
                    richmediaCreativeCode: {
                        required: true,

                    },
                    richMediaCreativePreview: {
                        extension: "jpg,jpeg,png,gif"
                    },
                    richmediaCreativeWidth: {
                        required: true,
                    },
                    richmediaCreativeHeight: {
                        required: true,
                    },
                    richmediaClickURL: {
                        required: true,
                    }
                },
                messages: {
                    richmediaCreativeName: {
                        required: "Please enter creative name",
                    },
                    richMediaCreativePreview: {
                        required: "Please upload creative image",
                        extension: "Invalid file extension, Upload image having jpg, jpeg,png,gif extension"
                    },
                    richmediaCreativeCode: {
                        required: "Please enter richmedia creative HTML/JS code",
                    },
                    richmediaCreativeWidth: {
                        required: "Please enter creative width",
                    },
                    richmediaCreativeHeight: {
                        required: "Please enter creative height",
                    },
                    richmediaClickURL: {
                        required: "Please enter click url",
                    }
                }
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }


    static handleNativeCreativeUploadEdit() {

        $('#submitNativeCreativeEdit').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    nativeCreativeName: {
                        required: true
                    },
                    nativeCreativeTitle: {
                        required: true
                    },
                    nativeCreativeDescription: {
                        required: true
                    },
                    nativeCreativeMainPreview: {
                        extension: "jpg,jpeg,png,gif"
                    },
                    nativeCreativeIcon: {
                        extension: "jpg,jpeg,png,gif"
                    },
                    nativeCreativeURL: {
                        required: true
                    },
                    nativeCreativeRating: {
                        required: true
                    },
                    nativeCalltoAction: {
                        required: true
                    }
                },
                messages: {
                    nativeCreativeName: {
                        required: "Please enter creative name"
                    },
                    nativeCreativeTitle: {
                        required: "Please enter creative title"
                    },
                    nativeCreativeDescription: {
                        required: "Please enter description"
                    },
                    nativeCreativeMainPreview: {
                        required: "Please upload creative main image",
                        extension: "Invalid file extension, Upload image having jpg, jpeg,png,gif extension"
                    },
                    nativeCreativeIcon: {
                        required: "Please upload creative icon",
                        extension: "Invalid file extension, Upload image having jpg, jpeg,png,gif extension"
                    },
                    nativeCreativeURL: {
                        required: "Please enter click url"
                    },
                    nativeCreativeRating: {
                        required: "Please enter rating"
                    },
                    nativeCalltoAction: {
                        required: "Please enter call to action text"
                    },
                    richmediaClickURL: {
                        required: "Please enter click url"
                    }
                }
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    static init() {
        CreativeValidations.handleBannerCreativeUpload();
        CreativeValidations.handleRichmediaCreativeUpload();
        CreativeValidations.handleNativeCreativeUpload();
    }
} 