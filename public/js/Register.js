! function xzxcxzcyz() {
    var t, e, v, h, r, n = {
            exports: function(r, a) {
                var n = {};

                function i(t, e, r, n) {
                    return t.addEventListener(e, r, n)
                }

                function o(t) {
                    return "string" == typeof t
                }

                function c(t, e) {
                    return t.getAttribute(e)
                }

                function s(t, e, r) {
                    return t.setAttribute(e, r)
                }
                return {
                    addClass: function(t, e) {
                        if (t.classList) return t.classList.add(e);
                        var r = t.className.split(" "); - 1 === r.indexOf(e) && (r.push(e), t.className = r.join(" "))
                    },
                    toggleClass: function(t, e) {
                        if (t.classList) return t.classList.toggle(e);
                        var r = t.className.split(" "),
                            n = r.indexOf(e); - 1 !== n ? r.splice(n, 1) : r.push(e), t.className = r.join(" ")
                    },
                    addClickListener: function(t, e) {
                        return i(t, "click", e)
                    },
                    addEventListener: i,
                    getAttribute: c,
                    getElementById: function(t) {
                        return a.getElementById(t)
                    },
                    getParent: function(t) {
                        return t.parentNode
                    },
                    isString: o,
                    loadScript: function(t) {
                        var e = a.createElement("script");
                        e.src = t, e.async = !0, a.body.appendChild(e)
                    },
                    poll: function(t) {
                        var i = t.interval || 2e3,
                            e = t.url || r.location.href,
                            o = t.condition || function() {
                                return !0
                            },
                            c = t.onSuccess || function() {},
                            s = t.onError || function() {};
                        return setTimeout(function n() {
                            var a = new XMLHttpRequest;
                            return a.open("GET", e), a.setRequestHeader("Accept", "application/json"), a.onload = function() {
                                if (200 === a.status) {
                                    var t = "application/json" === a.getResponseHeader("Content-Type").split(";")[0] ? JSON.parse(a.responseText) : a.responseText;
                                    return o(t) ? c() : setTimeout(n, i)
                                }
                                if (429 !== a.status) return s({
                                    status: a.status,
                                    responseText: a.responseText
                                });
                                var e = 1e3 * Number.parseInt(a.getResponseHeader("X-RateLimit-Reset")),
                                    r = e - (new Date).getTime();
                                return setTimeout(n, i < r ? r : i)
                            }, a.send()
                        }, i)
                    },
                    querySelector: function(t, e) {
                        return o(t) ? a.querySelector(t) : t.querySelector(e)
                    },
                    querySelectorAll: function(t, e) {
                        var r = o(t) ? a.querySelectorAll(t) : t.querySelectorAll(e);
                        return Array.prototype.slice.call(r)
                    },
                    removeClass: function(t, e) {
                        if (t.classList) return t.classList.remove(e);
                        var r = t.className.split(" "),
                            n = r.indexOf(e); - 1 !== n && (r.splice(n, 1), t.className = r.join(" "))
                    },
                    setAttribute: s,
                    removeAttribute: function(t, e) {
                        return t.removeAttribute(e)
                    },
                    swapAttributes: function(t, e, r) {
                        var n = c(t, e),
                            a = c(t, r);
                        s(t, r, n), s(t, e, a)
                    },
                    setGlobalFlag: function(t, e) {
                        n[t] = !!e
                    },
                    getGlobalFlag: function(t) {
                        return !!n[t]
                    },
                    preventFormSubmit: function(t) {
                        t.stopPropagation(), t.preventDefault()
                    },
                    matchMedia: function(t) {
                        return "function" != typeof r.matchMedia && r.matchMedia(t).matches
                    },
                    dispatchEvent: function(t, e, r) {
                        var n;
                        "function" != typeof Event ? (n = a.createEvent("Event")).initCustomEvent(e, r, !1) : n = new Event(e, {
                            bubbles: r
                        }), t.dispatchEvent(n)
                    },
                    setTimeout: setTimeout,
                    timeoutPromise: function(t, a) {
                        return new Promise(function(e, r) {
                            var n = setTimeout(function() {
                                r(new Error("timeoutPromise: promise timed out"))
                            }, t);
                            a.then(function(t) {
                                clearTimeout(n), e(t)
                            }, function(t) {
                                clearTimeout(n), r(t)
                            })
                        })
                    }
                }
            }
        }.exports(window, document),
        a = {
            exports: function(t, e) {
                for (var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", l = new Uint8Array(256), o = 0; o < i.length; o++) l[i.charCodeAt(o)] = o;

                function c(t) {
                    var e, r = new Uint8Array(t),
                        n = r.length,
                        a = "";
                    for (e = 0; e < n; e += 3) a += i[r[e] >> 2], a += i[(3 & r[e]) << 4 | r[e + 1] >> 4], a += i[(15 & r[e + 1]) << 2 | r[e + 2] >> 6], a += i[63 & r[e + 2]];
                    return n % 3 == 2 ? a = a.substring(0, a.length - 1) : n % 3 == 1 && (a = a.substring(0, a.length - 2)), a
                }

                function r() {
                    return navigator && navigator.credentials && "undefined" != typeof PublicKeyCredential
                }
                return {
                    base64URLEncode: c,
                    base64URLDecode: function(t) {
                        var e, r, n, a, i, o = .75 * t.length,
                            c = t.length,
                            s = 0,
                            u = new Uint8Array(o);
                        for (e = 0; e < c; e += 4) r = l[t.charCodeAt(e)], n = l[t.charCodeAt(e + 1)], a = l[t.charCodeAt(e + 2)], i = l[t.charCodeAt(e + 3)], u[s++] = r << 2 | n >> 4, u[s++] = (15 & n) << 4 | a >> 2, u[s++] = (3 & a) << 6 | 63 & i;
                        return u.buffer
                    },
                    publicKeyCredentialToJSON: function t(e) {
                        if (e instanceof Array) {
                            var r = [];
                            for (o = 0; o < e.length; o += 1) r.push(t(e[o]));
                            return r
                        }
                        if (e instanceof ArrayBuffer) return c(e);
                        if (e instanceof Object) {
                            var n = {};
                            for (var a in e) n[a] = t(e[a]);
                            return n
                        }
                        return e
                    },
                    str2ab: function(t) {
                        for (var e = new ArrayBuffer(t.length), r = new Uint8Array(e), n = 0, a = t.length; n < a; n++) r[n] = t.charCodeAt(n);
                        return e
                    },
                    isWebAuthnAvailable: r,
                    isWebauthnPlatformAuthenticatorAvailableAsync: function(t) {
                        return r() ? t(1e3, PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) : Promise.resolve(!1)
                    }
                }
            }
        }.exports(window, document);
    ((t = {}).exports = function(n, t, o, c, s, u, l) {
        t("div.ca2397246.password").forEach(function(t) {
            var a, i, e = n(t, "input"),
                r = n(t, '[data-action="toggle"]');
            o(t, (a = e, i = r, function(t) {
                if (t.target.classList.contains("ulp-button-icon")) {
                    if (a.type = "password" === a.type ? "text" : "password", i) {
                        var e = i.querySelector(".show-password-tooltip"),
                            r = i.querySelector(".hide-password-tooltip");
                        e && u(e, "hide"), r && u(r, "hide")
                    }
                    var n = l(a);
                    "text" === a.type ? c(n, "show") : s(n, "show")
                }
            }))
        })
    }, t.exports)(n.querySelector, n.querySelectorAll, n.addClickListener, n.addClass, n.removeClass, n.toggleClass, n.getParent), {
        exports: function(t, n, a, e) {
            var r = t(".cd31ffce6"),
                i = t("#alert-trigger"),
                o = t(".c622d842a"),
                c = t(".c5674ff9d"),
                s = !1;
            i && c && r && e(r, function(t) {
                var e = t.target === i,
                    r = c.contains(t.target);
                return e && !s ? (n(o, "show"), void(s = !0)) : e && s || s && !r ? (a(o, "show"), void(s = !1)) : void 0
            })
        }
    }.exports(n.querySelector, n.addClass, n.removeClass, n.addClickListener), (v = "recaptcha_v2", h = "recaptcha_enterprise", (e = {}).exports = function(t, a, i, o, c, n) {
        var s, u = a("div[data-recaptcha-sitekey]"),
            e = a("div[data-recaptcha-sitekey] input"),
            l = a("#ulp-recaptcha");

        function f() {
            return u.getAttribute("data-recaptcha-provider")
        }

        function d(t) {
            return e.value = t
        }

        function p(t, e) {
            if (t && t.getBoundingClientRect) {
                if (!n("(max-width: 480px)")) return l.style.transform = "", void(l.style.height = "");
                (void 0 === e || isNaN(e)) && (e = 1.4);
                var r = 72 * e;
                l.style.transform = "scale(" + e + ")", l.style.height = r + "px", l.style.width = "10px", u.clientWidth + 8 < t.getBoundingClientRect().width && p(t, e - .01)
            }
        }
        u && (s = "recaptchaCallback_" + Math.floor(1000001 * Math.random()), window[s] = function() {
            var t, e, r, n;
            delete window[s], t = function(t) {
                switch (t) {
                    case v:
                        return window.grecaptcha;
                    case h:
                        return window.grecaptcha.enterprise
                }
            }(f()), e = t.render(l, {
                sitekey: u.getAttribute("data-recaptcha-sitekey"),
                "expired-callback": function() {
                    d(""), i(u, "c0b7443dc"), t.reset(e)
                },
                callback: function(t) {
                    d(t), o(u, "c0b7443dc")
                }
            }), r = function(t) {
                p(t), c(window, "resize", function() {
                    p(t)
                })
            }, n = setInterval(function() {
                var t = a("#ulp-recaptcha iframe");
                if (t) return clearInterval(n), r(t)
            }, 200)
        }, t(function(t, e, r) {
            switch (t) {
                case v:
                    return "https://www.recaptcha.net/recaptcha/api.js?hl=" + e + "&onload=" + r;
                case h:
                    return "https://www.recaptcha.net/recaptcha/enterprise.js?render=explicit&hl=" + e + "&onload=" + r
            }
        }(f(), u.getAttribute("data-recaptcha-lang"), s)))
    }, e.exports)(n.loadScript, n.querySelector, n.addClass, n.removeClass, n.addEventListener, n.matchMedia), ((r = {}).exports = function(n, t, a, i, o, c, s, u, r, l) {
        function f(t) {
            var e = t.target,
                r = c(e);
            e.value || l(e, "data-autofilled") ? i(r, "c5786b49b") : o(r, "c5786b49b")
        }

        function d(t) {
            var e = t.target;
            "onAutoFillStart" === t.animationName && (r(e, "data-autofilled", !0), u(t.target, "change", !0), a(e, "keyup", p, {
                once: !0
            }))
        }

        function p(t) {
            var e = t.target;
            r(e, "data-autofilled", "")
        }
        if (n("body._simple-labels")) return t(".c04048bbd.no-js").forEach(function(t) {
            o(t, "no-js")
        }), void t(".c04048bbd.js-required").forEach(function(t) {
            i(t, "hide")
        });
        t(".ca2397246:not(.cb7514801):not(disabled)").forEach(function(t) {
            i(t, "c15fce3c6");
            var e, r = n(t, ".input");
            r.value && i(t, "c5786b49b"), a(t, "change", f), a(r, "blur", f), a(r, "animationstart", d), e = r, s(function() {
                e.value && u(e, "change", !0)
            }, 100)
        })
    }, r.exports)(n.querySelector, n.querySelectorAll, n.addEventListener, n.addClass, n.removeClass, n.getParent, n.setTimeout, n.dispatchEvent, n.setAttribute, n.getAttribute), {
        exports: function(t, e, r, n, a, i) {
            function o(t) {
                var e = r("submitted");
                n("submitted", !0), e ? a(t) : "apple" === i(t.target, "data-provider") && setTimeout(function() {
                    n("submitted", !1)
                }, 2e3)
            }
            var c = t("form");
            c && c.forEach(function(t) {
                e(t, "submit", o)
            })
        }
    }.exports(n.querySelectorAll, n.addEventListener, n.getGlobalFlag, n.setGlobalFlag, n.preventFormSubmit, n.getAttribute), {
        exports: function(e, t, r) {
            var n = e("form._form-detect-browser-capabilities"),
                a = e("main.login-id");
            if (n || a) {
                var i = t.isWebAuthnAvailable();
                e("#webauthn-available").value = i ? "true" : "false", e("#js-available").value = "true", navigator.brave ? navigator.brave.isBrave().then(function(t) {
                    e("#is-brave").value = t, o()
                }) : o()
            }

            function o() {
                i ? t.isWebauthnPlatformAuthenticatorAvailableAsync(r).then(function(t) {
                    e("#webauthn-platform-available").value = t ? "true" : "false", n && n.submit()
                }).catch(function(t) {
                    e("#webauthn-platform-available").value = "false", n && n.submit()
                }) : (e("#webauthn-platform-available").value = "false", n && n.submit())
            }
        }
    }.exports(n.querySelector, a, n.timeoutPromise)
}();
