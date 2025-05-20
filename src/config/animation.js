export const animation = {
    easing: {
        swing: function (progress) {
            return 0.5 - Math.cos(progress * Math.PI) / 2
        },
    },
    animate: function (options) {
        const start = new Date()
        const id = setInterval(function () {
            const timePassed = new Date() - start
            let progress = timePassed / options.duration
            if (progress > 1) {
                progress = 1
            }
            options.progress = progress
            const delta = options.delta(progress)
            options.step(delta)
            if (progress === 1) {
                clearInterval(id)
            }
        }, options.delay || 10)
    },
    fadeOut: function (element, options) {
        const to = 1
        this.animate({
            duration: options.duration,
            delta: function (progress) {
                progress = this.progress
                return animation.easing.swing(progress)
            },
            step: function (delta) {
                element.style.opacity = to - delta
            }
        })
    },
    fadeIn: function (element, options) {
        const to = 0
        this.animate({
            duration: options.duration,
            delta: function (progress) {
                progress = this.progress
                return animation.easing.swing(progress)
            },
            step: function (delta) {
                element.style.opacity = to + delta
            }
        })
    }
}