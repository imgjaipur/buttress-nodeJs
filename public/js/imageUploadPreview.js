// =========== All Global Variables ==============
var result, imgSrc, img_result, img_w, img_h, options, save, cropped, dwn, x, d, lab, par, cropper, dwnImg, reader, aspct, kuchbhi, crop_box_height, crop_box_width, c, d, name;

// =========== All custom options ==============
var readURL = function (input, lab, name) {
    x = name.split("C:\\fakepath\\");
    if (input.files && input.files[0]) {
        reader = new FileReader();
        reader.onload = function (e) {
            if (e.target.result) {
                aspct = par.attr('data-aspact-ratio');
                // create new image
                let img = document.createElement('img');
                img.id = 'image';
                img.src = e.target.result;
                imgSrc = e.target.result
                // clean result before
                result.innerHTML = ' ';
                // append new image
                result.appendChild(img);
                // init cropper
                cropper = new Cropper(img, {

                    // The view mode of the cropper
                    viewMode: 1,
                    // 0, 1, 2, 3

                    // The dragging mode of the cropper
                    dragMode: 'move',
                    // 'crop', 'move' or 'none'

                    // The aspect ratio of the crop box
                    aspectRatio: parseInt(aspct),

                    // Re-render the cropper when resize the window
                    responsive: true,

                    // Show the center indicator for guiding
                    center: true,

                    // Enable to crop the image automatically when initialize
                    autoCrop: true,

                    // Define the percentage of automatic cropping area when initializes
                    autoCropArea: 1,

                    // Enable to move the image
                    movable: true,

                    // Enable to rotate the image
                    rotatable: true,

                    // Enable to scale the image
                    scalable: true,

                    // Enable to zoom the image
                    zoomable: true,

                    // Enable to zoom the image by dragging touch
                    zoomOnTouch: true,

                    // Enable to zoom the image by wheeling mouse
                    zoomOnWheel: true,

                    // Toggle drag mode between "crop" and "move" when click twice on the cropper
                    toggleDragModeOnDblclick: true,

                    // Enable to move the crop box
                    cropBoxMovable: true,

                    // Enable to resize the crop box
                    cropBoxResizable: true,

                    rounded: true,

                    crop: function (e) {
                        crop_box_width = $(".cropper-crop-box").width();
                        crop_box_height = $(".cropper-crop-box").height();
                        if ((Math.round(e.detail.width) == 0) || (Math.round(e.detail.height) == 0)) {
                            showImageSizes = 'auto';
                        } else {
                            showImageSizes = Math.round(e.detail.width) + 'X' + Math.round(e.detail.height);
                        };
                        $(".setImageSizes").text(showImageSizes);
                        $('#widthCustom').val(Math.round(e.detail.width));
                        $('#heightCustom').val(Math.round(e.detail.height));
                        if (crop_box_width <= 60) {
                            $(".cropper-crop-box").addClass("crop-box-responsive-w");
                        } else {
                            $(".cropper-crop-box").removeClass("crop-box-responsive-w");
                        }
                        if (crop_box_height <= 60) {
                            $(".cropper-crop-box").addClass("crop-box-responsive-h");
                        } else {
                            $(".cropper-crop-box").removeClass("crop-box-responsive-h");
                        }
                    }
                });
            }
        }
        reader.readAsDataURL(input.files[0]);

        $('.crop-loader').removeClass('active');
    }
}
var readUrlWithoutCrop = function (input, lab, name) {
    x = name.split("C:\\fakepath\\");
    if (input.files && input.files[0]) {
        reader = new FileReader();
        reader.onload = function (e) {
            lab.addClass('file-uploaded');
            lab.attr('style', 'background-image:url(' + e.target.result + ')');
            lab.children().replaceWith('<span>' + x[1] + '</span>');
        }
        reader.readAsDataURL(input.files[0]);
    }
};

// =========== Remove cropper modal on click ==============
function closeCropper() {
    $('#' + d).children('#imageCroper' + d).remove();
    $('.custom-file-upload input').val('');
};
// =========== Create cropper modal on click '.custom-file-upload-input' class ==============
$(".custom-file-upload input").on('click', function () {
    $('.crop-loader').addClass('active');
    c = $(this).parent().attr("data-crop");
    d = $(this).parent().attr("data-view-location");
    $('#' + d).addClass("position-relative");
    if (c == 'true') {
        $('#' + d).children('#imageCroper' + d).remove();
        $("#" + d).append(` <div class="modalCustom fade" id="imageCroper` + d + `">
                                <div class="crop-loader"></div>
                                <div class="modalCustom-dialog modalCustom-fullscreen modalCustom-dialog-scrollable modalCustom-dialog-centered w-100">
                                    <div class="modalCustom-content">

                                        <div class="modalCustom downloadConfirmBox fade" id="downloadConfirmBox">
                                            <div class="modalCustom-dialog modalCustom-dialog-centered modal-sm">
                                                <div class="modalCustom-content rounded w-75 mx-auto">
                                                    <div class="modalCustom-header justify-content-center bg-dark border-0 fs-15 fw-bold">Are you sure!</div>
                                                    <div class="modalCustom-body bg-dark text-center pt-1 fs-12">You want to download this image</div>
                                                    <div class="modalCustom-footer justify-content-center bg-dark border-0">
                                                        <div class="row mx-0 w-100 align-items-center justify-content-center">
                                                            <div class="col-auto text-center px-1" id="waitForCanvasDownload">
                                                                <a id="downloadimages" onClick="downloadCloseBtn()" class="btn btn-dark border rounded-pill zi-1 text-white fs-10 fw-bold text-uppercase col-auto">
                                                                    <i class="me-1 imgl img-arrow-alt-to-bottom"></i> Download
                                                                </a>
                                                            </div>
                                                            <div class="col-auto text-center px-1">
                                                                <a onClick="downloadCloseBtn()" class="btn btn-dark border rounded-pill zi-1 text-white fs-10 fw-bold text-uppercase col-auto">
                                                                    <i class="me-1 imgl img-times-circle"></i> Cancel
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="modalCustom setImageSize fade" id="setImageSize">
                                            <div class="modalCustom-dialog modalCustom-dialog-centered modal-sm">
                                                <div class="modalCustom-content rounded w-75 mx-auto">
                                                    <div class="modalCustom-header justify-content-center bg-dark border-0 fs-15 fw-bold">Custom Crop Ratio</div>
                                                    <div class="modalCustom-body bg-dark text-center pt-1 fs-12">
                                                        <div class="row">
                                                            <div class="col">
                                                                <div class="form-floating mb-3">
                                                                    <input type="tel" class="form-control border text-white" id="widthCustom" placeholder="widthCustom">
                                                                    <label for="widthCustom">Width</label>
                                                                </div>
                                                            </div>
                                                            <div class="col">
                                                                <div class="form-floating">
                                                                    <input type="tel" class="form-control border text-white" id="heightCustom" placeholder="heightCustom">
                                                                    <label for="heightCustom">Height</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="modalCustom-footer justify-content-end bg-dark border-0">
                                                        <div class="row mx-0 w-100 align-items-center justify-content-end">
                                                            <div class="col-auto text-center px-1">
                                                                <a onClick="setImageSizeCloseBtn()" class="btn btn-dark border rounded-pill zi-1 text-white fs-10 fw-bold text-uppercase col-auto">Cancel</a>
                                                            </div>
                                                            <div class="col-auto text-center px-1">
                                                                <a class="btn btn-dark border rounded-pill zi-1 text-white fs-10 fw-bold text-uppercase col-auto">Resize</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="modalCustom-header justify-content-center border-0">
                                            <div class="row justify-content-between mx-0 w-100">
                                                <a href="javascript:;" onclick="closeCropper()" class="btn zi-1 text-white fs-25 mx-2 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                    <span class="imgl img-times"></span>
                                                </a>
                                                <a href="javascript:;" id="reset" onclick="reset()" class="btn zi-1 text-white fs-20 mx-3 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                    <span class="imgl img-repeat"></span>
                                                </a>
                                                <a href="javascript:;" onClick="setImageSizeBtn()" class="col-auto fw-bold fs-13 mx-auto text-white d-inline-flex align-items-center">
                                                    <span class="setImageSizes"></span>
                                                    <span class="ms-1 position-relative top-n2px fs-17"><i class="imgs img-sort-down"></i></span>
                                                </a>
                                                <div id="rightCropperBtn" class="col-auto text-right d-flex justify-content-end px-0"></div>
                                                <a href="javascript:;" onCLick="addEvents()" id='save' class="btn zi-1 text-white fs-20 mx-2 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                    <span class="imgl img-check"></span>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="modalCustom-body text-dark">
                                            <div class="row mx-0 h-100">
                                                <!-- leftbox -->
                                                <div class="box-2 col-12 px-0 h-100">
                                                    <div id="result` + d + `" class="result h-100"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modalCustom-footer justify-content-center border-0">
                                            <div class="row mx-0 w-100 align-items-center justify-content-between">
                                                <div class="col-auto px-0 btnBoxings">
                                                    <a href="javascript:;" onClick="DragModeMove()" class="btn zi-1 text-white fs-20 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                        <span class="imgl img-arrows-alt"></span>
                                                    </a>
                                                </div>
                                                <div class="col-auto px-0 btnBoxings">
                                                    <a href="javascript:;" onClick="DragModeCrop()" class="btn zi-1 text-white fs-20 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                        <span class="imgl img-crop"></span>
                                                    </a>
                                                </div>
                                                <div id="zoomInBtn" class="col-auto px-0 btnBoxings"></div>
                                                <div id="zoomOutBtn" class="col-auto px-0 btnBoxings"></div>
                                                <div class="col-auto px-0 btnBoxings">
                                                    <a href="javascript:;" onClick="scaleYBtn()" id="scaleYBtn" class="btn zi-1 text-white fs-20 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                        <span class="imgl img-arrows-v"></span>
                                                    </a>
                                                </div>
                                                <div class="col-auto px-0 btnBoxings">
                                                    <a href="javascript:;" onClick="scaleXBtn()" id="scaleXBtn" class="btn zi-1 text-white fs-20 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                        <span class="imgl img-arrows-h"></span>
                                                    </a>
                                                </div>
                                                <div class="col-auto px-0 btnBoxings">
                                                    <a href="javascript:;" id="clear" onclick="cleared()" class="btn zi-1 text-white fs-20 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                        <span class="imgl img-eraser"></span>
                                                    </a>
                                                </div>
                                                <div class="col-auto px-0 btnBoxings" id="dowloadPosition"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`);
    }
});

// =========== Load image on input onchange ==============
$(".custom-file-upload input").on('change', function () {

    lab = $(this).next();
    name = $(this).val();
    par = $(this).parent();
    c = $(this).parent().attr("data-crop");
    d = $(this).parent().attr("data-view-location");
    if (c == 'true') {
        $('#' + d).children('#imageCroper' + d).show();
        $('#' + d).children('#imageCroper' + d).addClass('show');
        if (par.attr("data-zoom") == "true") {
            $('#zoomInBtn').append(`  <button type="button" id="zoomIN" onClick="zoomin()" class="btn zi-1 text-white fs-20 fw-bold text-uppercase p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                <i class="imgl img-search-plus"></i>
                                            </button>`);
            $('#zoomOutBtn').append(`  <button type="button" id="zoomOut" onClick="zoomout()" class="btn zi-1 text-white fs-20 fw-bold text-uppercase p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                <i class="imgl img-search-minus"></i>
                                            </button>`);
        }
        if (par.attr("data-rotate") == "true") {
            $('#rightCropperBtn').append(`  <!--<button type="button" id="rotateR" onClick="rorateLeft()" class="btn zi-1 text-white fs-18 mx-3 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                <i class="imgl img-undo"></i>
                                            </button> -->
                                            <button type="button" id="rotateL" onClick="rotateRight()" class="btn zi-1 text-white fs-18 mx-3 fw-bold text-uppercase col-auto p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                <i class="imgl img-redo"></i>
                                            </button>`);
        }
        if (par.attr("data-download") == "true") {
            $('#dowloadPosition').append(`  <a onClick="downloadBtn()" download="cropper.png" class="btn zi-1 text-white fs-20 fw-bold text-uppercase p-0 h-30px d-flex align-items-center justify-content-center shadow-none">
                                                <i class="imgl img-arrow-alt-to-bottom"></i>
                                            </a>`);
        }
        result = document.querySelector('.result'),
            imgSrc = null
        img_result = document.querySelector('.img-result'),
            img_w = document.querySelector('.img-w'),
            img_h = document.querySelector('.img-h'),
            options = document.querySelector('.options'),
            save = document.querySelector('.save'),
            cropped = document.querySelector('.cropped');
        if (par.attr("data-download") == "true") {
            dwn = document.querySelector('#download');
        }
        readURL(this, lab, name);
    } else {
        readUrlWithoutCrop(this, lab, name);
    }
});
function zoomin() {
    cropper.zoom(0.1);
}
function zoomout() {
    cropper.zoom(-0.1);
}
function rotateRight() {
    cropper.rotate(90);
}
function rorateLeft() {
    cropper.rotate(-90);
}
function scaleXBtn() {
    if ($('#scaleXBtn').hasClass('scaleXBtn')) {
        cropper.scaleX(1);
        $('#scaleXBtn').removeClass('scaleXBtn');
    } else {
        cropper.scaleX(-1);
        $('#scaleXBtn').addClass('scaleXBtn');
    }
}
function scaleYBtn() {
    if ($('#scaleYBtn').hasClass('scaleYBtn')) {
        cropper.scaleY(1);
        $('#scaleYBtn').removeClass('scaleYBtn');
    } else {
        cropper.scaleY(-1);
        $('#scaleYBtn').addClass('scaleYBtn');
    }
}
function DragModeMove() {
    cropper.setDragMode('move');
}
function DragModeCrop() {
    cropper.setDragMode('crop');
}
function reset() {
    cropper.reset();
    cropper.crop();
}
function cleared() {
    cropper.clear();
}

// =========== Save Changes Button ==============
function addEvents() {
    $('.crop-loader').addClass('active');
    $('#' + d).children('#imageCroper' + d).remove();
    event.preventDefault();
    // get result to data uri
    imgSrc = cropper.getCroppedCanvas({}).toDataURL();
    setTimeout(function () {
        lab.addClass('file-uploaded');
        lab.attr('style', 'background-image:url(' + imgSrc + ')');
        lab.children().replaceWith('<span>' + x[1] + '</span>');
    }, 1000);

    $('.custom-file-upload input').val('');
}
;
// =========== Crop image download ==============
function downloadBtn() {
    $('#downloadConfirmBox').addClass("show").show();
    if (par.attr("data-download") == "true") {
        $('#downloadimages').hide();
        $('#waitForCanvasDownload').append(` <a class="btn btn-dark border rounded-pill zi-1 text-white fs-10 fw-bold text-uppercase col-auto waitForCanvasDownload">
                                                <i class="me-1 imgl img-sync-alt"></i> Loading...
                                            </a>`);
    }

    setTimeout(function () {
        imgSrc = cropper.getCroppedCanvas();
        var d = document.querySelector('#downloadimages');
        d.download = x[1];
        d.setAttribute('href', imgSrc.toDataURL());
        if (par.attr("data-download") == "true") {
            $('#waitForCanvasDownload .waitForCanvasDownload').hide();
            $('#downloadimages').show();
        }

    }, 1500);
}
;
// =========== Crop image download modal close ==============
function downloadCloseBtn() {
    $('#downloadConfirmBox').removeClass("show").hide();
}

// =========== Set Image Size Modal Open & Close ==============
function setImageSizeBtn() {
    $('#setImageSize').addClass("show").show();
}
function setImageSizeCloseBtn() {
    $('#setImageSize').removeClass("show").hide();
}







