document.querySelectorAll(".color-switch").forEach(element => {
    element.addEventListener('click', (e) => {

        $(element).siblings('label').removeClass('active');
        $(element).addClass('active');

        const variation = JSON.parse(element.getAttribute("data-variation"));
        const options = JSON.parse(element.getAttribute("data-options"));
        const target = element.getAttribute("data-target")

        const find = options.find((opt) => opt.variant.indexOf(variation.name) > -1 && opt.images);
        if (find) {
            const image = find.images.split(',')[0];
            document.querySelector(`[data-product-id="${target}"]`).style.backgroundImage = `url('${image}')`;
        }
    });
});
