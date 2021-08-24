
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.34.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var page = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var suffix = res[6];
        var asterisk = res[7];

        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        var delimiter = prefix || '/';
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile (str) {
      return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^' + tokens[i].pattern + '$');
        }
      }

      return function (obj) {
        var path = '';
        var data = obj || {};

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encodeURIComponent(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = encodeURIComponent(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path);
      var re = tokensToRegExp(tokens, options);

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i]);
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';
      var lastToken = tokens[tokens.length - 1];
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = token.pattern;

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || [];

      if (!isarray(keys)) {
        options = keys;
        keys = [];
      } else if (!options) {
        options = {};
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    /**
       * Module dependencies.
       */

      

      /**
       * Short-cuts for global-object checks
       */

      var hasDocument = ('undefined' !== typeof document);
      var hasWindow = ('undefined' !== typeof window);
      var hasHistory = ('undefined' !== typeof history);
      var hasProcess = typeof process !== 'undefined';

      /**
       * Detect click event
       */
      var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var isLocation = hasWindow && !!(window.history.location || window.location);

      /**
       * The page instance
       * @api private
       */
      function Page() {
        // public things
        this.callbacks = [];
        this.exits = [];
        this.current = '';
        this.len = 0;

        // private things
        this._decodeURLComponents = true;
        this._base = '';
        this._strict = false;
        this._running = false;
        this._hashbang = false;

        // bound functions
        this.clickHandler = this.clickHandler.bind(this);
        this._onpopstate = this._onpopstate.bind(this);
      }

      /**
       * Configure the instance of page. This can be called multiple times.
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.configure = function(options) {
        var opts = options || {};

        this._window = opts.window || (hasWindow && window);
        this._decodeURLComponents = opts.decodeURLComponents !== false;
        this._popstate = opts.popstate !== false && hasWindow;
        this._click = opts.click !== false && hasDocument;
        this._hashbang = !!opts.hashbang;

        var _window = this._window;
        if(this._popstate) {
          _window.addEventListener('popstate', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('popstate', this._onpopstate, false);
        }

        if (this._click) {
          _window.document.addEventListener(clickEvent, this.clickHandler, false);
        } else if(hasDocument) {
          _window.document.removeEventListener(clickEvent, this.clickHandler, false);
        }

        if(this._hashbang && hasWindow && !hasHistory) {
          _window.addEventListener('hashchange', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('hashchange', this._onpopstate, false);
        }
      };

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      Page.prototype.base = function(path) {
        if (0 === arguments.length) return this._base;
        this._base = path;
      };

      /**
       * Gets the `base`, which depends on whether we are using History or
       * hashbang routing.

       * @api private
       */
      Page.prototype._getBase = function() {
        var base = this._base;
        if(!!base) return base;
        var loc = hasWindow && this._window && this._window.location;

        if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
          base = loc.pathname;
        }

        return base;
      };

      /**
       * Get or set strict path matching to `enable`
       *
       * @param {boolean} enable
       * @api public
       */

      Page.prototype.strict = function(enable) {
        if (0 === arguments.length) return this._strict;
        this._strict = enable;
      };


      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.start = function(options) {
        var opts = options || {};
        this.configure(opts);

        if (false === opts.dispatch) return;
        this._running = true;

        var url;
        if(isLocation) {
          var window = this._window;
          var loc = window.location;

          if(this._hashbang && ~loc.hash.indexOf('#!')) {
            url = loc.hash.substr(2) + loc.search;
          } else if (this._hashbang) {
            url = loc.search + loc.hash;
          } else {
            url = loc.pathname + loc.search + loc.hash;
          }
        }

        this.replace(url, null, true, opts.dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      Page.prototype.stop = function() {
        if (!this._running) return;
        this.current = '';
        this.len = 0;
        this._running = false;

        var window = this._window;
        this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
        hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
        hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      Page.prototype.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        if (false !== dispatch) this.dispatch(ctx, prev);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      Page.prototype.back = function(path, state) {
        var page = this;
        if (this.len > 0) {
          var window = this._window;
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          hasHistory && window.history.back();
          this.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        } else {
          setTimeout(function() {
            page.show(page._getBase(), state);
          });
        }
      };

      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      Page.prototype.redirect = function(from, to) {
        var inst = this;

        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page.call(this, from, function(e) {
            setTimeout(function() {
              inst.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            inst.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      Page.prototype.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) this.dispatch(ctx, prev);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */

      Page.prototype.dispatch = function(ctx, prev) {
        var i = 0, j = 0, page = this;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled.call(page, ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      Page.prototype.exit = function(path, fn) {
        if (typeof path === 'function') {
          return this.exit('*', path);
        }

        var route = new Route(path, null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Handle "click" events.
       */

      /* jshint +W054 */
      Page.prototype.clickHandler = function(e) {
        if (1 !== this._which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;

        // ensure link
        // use shadow dom when available if not, fall back to composedPath()
        // for browsers that only have shady
        var el = e.target;
        var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

        if(eventPath) {
          for (var i = 0; i < eventPath.length; i++) {
            if (!eventPath[i].nodeName) continue;
            if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
            if (!eventPath[i].href) continue;

            el = eventPath[i];
            break;
          }
        }

        // continue ensure link
        // el.nodeName for svg links are 'a' instead of 'A'
        while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
        if (!el || 'A' !== el.nodeName.toUpperCase()) return;

        // check if link is inside an svg
        // in this case, both href and target are always inside an object
        var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        // svg target is an object and its desired value is in .baseVal property
        if (svg ? el.target.baseVal : el.target) return;

        // x-origin
        // note: svg links that are not relative don't call click events (and skip page.js)
        // consequently, all svg links tested inside page.js are relative and in the same origin
        if (!svg && !this.sameOrigin(el.href)) return;

        // rebuild path
        // There aren't .pathname and .search properties in svg links, so we use href
        // Also, svg href is an object and its desired value is in .baseVal property
        var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

        path = path[0] !== '/' ? '/' + path : path;

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;
        var pageBase = this._getBase();

        if (path.indexOf(pageBase) === 0) {
          path = path.substr(pageBase.length);
        }

        if (this._hashbang) path = path.replace('#!', '');

        if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
          return;
        }

        e.preventDefault();
        this.show(orig);
      };

      /**
       * Handle "populate" events.
       * @api private
       */

      Page.prototype._onpopstate = (function () {
        var loaded = false;
        if ( ! hasWindow ) {
          return function () {};
        }
        if (hasDocument && document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          var page = this;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else if (isLocation) {
            var loc = page._window.location;
            page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
          }
        };
      })();

      /**
       * Event button.
       */
      Page.prototype._which = function(e) {
        e = e || (hasWindow && this._window.event);
        return null == e.which ? e.button : e.which;
      };

      /**
       * Convert to a URL object
       * @api private
       */
      Page.prototype._toURL = function(href) {
        var window = this._window;
        if(typeof URL === 'function' && isLocation) {
          return new URL(href, window.location.toString());
        } else if (hasDocument) {
          var anc = window.document.createElement('a');
          anc.href = href;
          return anc;
        }
      };

      /**
       * Check if `href` is the same origin.
       * @param {string} href
       * @api public
       */
      Page.prototype.sameOrigin = function(href) {
        if(!href || !isLocation) return false;

        var url = this._toURL(href);
        var window = this._window;

        var loc = window.location;

        /*
           When the port is the default http port 80 for http, or 443 for
           https, internet explorer 11 returns an empty string for loc.port,
           so we need to compare loc.port with an empty string if url.port
           is the default port 80 or 443.
           Also the comparition with `port` is changed from `===` to `==` because
           `port` can be a string sometimes. This only applies to ie11.
        */
        return loc.protocol === url.protocol &&
          loc.hostname === url.hostname &&
          (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
      };

      /**
       * @api private
       */
      Page.prototype._samePath = function(url) {
        if(!isLocation) return false;
        var window = this._window;
        var loc = window.location;
        return url.pathname === loc.pathname &&
          url.search === loc.search;
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       * @api private
       */
      Page.prototype._decodeURLEncodedURIComponent = function(val) {
        if (typeof val !== 'string') { return val; }
        return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      };

      /**
       * Create a new `page` instance and function
       */
      function createPage() {
        var pageInstance = new Page();

        function pageFn(/* args */) {
          return page.apply(pageInstance, arguments);
        }

        // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
        pageFn.callbacks = pageInstance.callbacks;
        pageFn.exits = pageInstance.exits;
        pageFn.base = pageInstance.base.bind(pageInstance);
        pageFn.strict = pageInstance.strict.bind(pageInstance);
        pageFn.start = pageInstance.start.bind(pageInstance);
        pageFn.stop = pageInstance.stop.bind(pageInstance);
        pageFn.show = pageInstance.show.bind(pageInstance);
        pageFn.back = pageInstance.back.bind(pageInstance);
        pageFn.redirect = pageInstance.redirect.bind(pageInstance);
        pageFn.replace = pageInstance.replace.bind(pageInstance);
        pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
        pageFn.exit = pageInstance.exit.bind(pageInstance);
        pageFn.configure = pageInstance.configure.bind(pageInstance);
        pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
        pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

        pageFn.create = createPage;

        Object.defineProperty(pageFn, 'len', {
          get: function(){
            return pageInstance.len;
          },
          set: function(val) {
            pageInstance.len = val;
          }
        });

        Object.defineProperty(pageFn, 'current', {
          get: function(){
            return pageInstance.current;
          },
          set: function(val) {
            pageInstance.current = val;
          }
        });

        // In 2.0 these can be named exports
        pageFn.Context = Context;
        pageFn.Route = Route;

        return pageFn;
      }

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page.call(this, '*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path), null, this);
          for (var i = 1; i < arguments.length; ++i) {
            this.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          this.start(path);
        }
      }

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;
        var page = this;
        var window = page._window;

        if (page._hashbang) {
          current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
        } else {
          current = isLocation && window.location.pathname + window.location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        isLocation && (window.location.href = ctx.canonicalPath);
      }

      /**
       * Escapes RegExp characters in the given string.
       *
       * @param {string} s
       * @api private
       */
      function escapeRegExp(s) {
        return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state, pageInstance) {
        var _page = this.page = pageInstance || page;
        var window = _page._window;
        var hashbang = _page._hashbang;

        var pageBase = _page._getBase();
        if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        var re = new RegExp('^' + escapeRegExp(pageBase));
        this.path = path.replace(re, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = (hasDocument && window.document.title);
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = this.pathname = parts[0];
          this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        var page = this.page;
        var window = page._window;
        var hashbang = page._hashbang;

        page.len++;
        if (hasHistory) {
            window.history.pushState(this.state, this.title,
              hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        var page = this.page;
        if (hasHistory) {
            page._window.history.replaceState(this.state, this.title,
              page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options, page) {
        var _page = this.page = page || globalPage;
        var opts = options || {};
        opts.strict = opts.strict || _page._strict;
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
      }

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) {
            ctx.routePath = self.path;
            return fn(ctx, next);
          }
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        delete params[0];

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = this.page._decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Module exports.
       */

      var globalPage = createPage();
      var page_js = globalPage;
      var default_1 = globalPage;

    page_js.default = default_1;

    return page_js;

    })));
    });

    /* src\template\NavBar\NavBar.svelte generated by Svelte v3.34.0 */

    const file$b = "src\\template\\NavBar\\NavBar.svelte";

    function create_fragment$b(ctx) {
    	let div2;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let ul;
    	let li0;
    	let a1;
    	let t2;
    	let li1;
    	let a2;
    	let t4;
    	let li2;
    	let a3;
    	let t6;
    	let li3;
    	let a4;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "소개";
    			t2 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "기록";
    			t4 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "SPC";
    			t6 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "가입 및 문의";
    			attr_dev(img, "class", "navbar_logo svelte-26g7em");
    			if (img.src !== (img_src_value = "/res/logo-crimson.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Sogang ACM-ICPC Team");
    			add_location(img, file$b, 9, 3, 168);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-26g7em");
    			add_location(a0, file$b, 8, 2, 151);
    			attr_dev(div0, "class", "navbar_logo_container svelte-26g7em");
    			add_location(div0, file$b, 7, 1, 112);
    			attr_dev(a1, "href", "/introduction");
    			attr_dev(a1, "class", "svelte-26g7em");
    			add_location(a1, file$b, 14, 24, 338);
    			attr_dev(li0, "class", "nav_item svelte-26g7em");
    			add_location(li0, file$b, 14, 3, 317);
    			attr_dev(a2, "href", "/history");
    			attr_dev(a2, "class", "svelte-26g7em");
    			add_location(a2, file$b, 15, 24, 399);
    			attr_dev(li1, "class", "nav_item svelte-26g7em");
    			add_location(li1, file$b, 15, 3, 378);
    			attr_dev(a3, "href", "/spc");
    			attr_dev(a3, "class", "svelte-26g7em");
    			add_location(a3, file$b, 16, 24, 455);
    			attr_dev(li2, "class", "nav_item svelte-26g7em");
    			add_location(li2, file$b, 16, 3, 434);
    			attr_dev(a4, "href", "/contact");
    			attr_dev(a4, "class", "svelte-26g7em");
    			add_location(a4, file$b, 17, 24, 508);
    			attr_dev(li3, "class", "nav_item svelte-26g7em");
    			add_location(li3, file$b, 17, 3, 487);
    			add_location(ul, file$b, 13, 2, 308);
    			attr_dev(div1, "class", "navbar_nav_container svelte-26g7em");
    			add_location(div1, file$b, 12, 1, 270);
    			attr_dev(div2, "class", "navbar svelte-26g7em");
    			add_location(div2, file$b, 6, 0, 89);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavBar", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\template\Footer\Footer.svelte generated by Svelte v3.34.0 */

    const file$a = "src\\template\\Footer\\Footer.svelte";

    function create_fragment$a(ctx) {
    	let div13;
    	let div11;
    	let div3;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let br2;
    	let t5;
    	let br3;
    	let t6;
    	let t7;
    	let div10;
    	let div6;
    	let div4;
    	let t9;
    	let div5;
    	let t10;
    	let br4;
    	let t11;
    	let t12;
    	let div9;
    	let div7;
    	let t14;
    	let div8;
    	let t15;
    	let br5;
    	let t16;
    	let t17;
    	let div12;
    	let span;
    	let t19;
    	let ul;
    	let li0;
    	let a0;
    	let t21;
    	let li1;
    	let a1;
    	let t23;
    	let li2;
    	let a2;
    	let t25;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			div11 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Sogang ICPC Team";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("04107");
    			br0 = element("br");
    			t3 = text("\r\n\t\t\t\t\t서울특별시 마포구 백범로 35");
    			br1 = element("br");
    			t4 = text("\r\n\t\t\t\t\t서강대학교 김대건관");
    			br2 = element("br");
    			t5 = text("\r\n\t\t\t\t\t5층 K512");
    			br3 = element("br");
    			t6 = text("\r\n\t\t\t\t\tsogang@acmicpc.team");
    			t7 = space();
    			div10 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			div4.textContent = "학회장";
    			t9 = space();
    			div5 = element("div");
    			t10 = text("이민희");
    			br4 = element("br");
    			t11 = text("\r\n\t\t\t\t\tminigimbob@gmail.com");
    			t12 = space();
    			div9 = element("div");
    			div7 = element("div");
    			div7.textContent = "부학회장";
    			t14 = space();
    			div8 = element("div");
    			t15 = text("이동주");
    			br5 = element("br");
    			t16 = text("\r\n\t\t\t\t\tnant0313@gmail.com");
    			t17 = space();
    			div12 = element("div");
    			span = element("span");
    			span.textContent = "© 2005—2021 Sogang ICPC Team";
    			t19 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "컴퓨터공학과";
    			t21 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "BOJ 그룹";
    			t23 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "solved.ac";
    			t25 = space();
    			img = element("img");
    			attr_dev(div0, "class", "left svelte-xzsndc");
    			add_location(div0, file$a, 7, 4, 126);
    			add_location(br0, file$a, 9, 10, 203);
    			add_location(br1, file$a, 10, 21, 232);
    			add_location(br2, file$a, 11, 15, 255);
    			add_location(br3, file$a, 12, 12, 275);
    			attr_dev(div1, "class", "right svelte-xzsndc");
    			add_location(div1, file$a, 8, 4, 172);
    			attr_dev(div2, "class", "svelte-xzsndc");
    			add_location(div2, file$a, 6, 3, 115);
    			attr_dev(div3, "class", "footer_item svelte-xzsndc");
    			add_location(div3, file$a, 5, 2, 85);
    			attr_dev(div4, "class", "left svelte-xzsndc");
    			add_location(div4, file$a, 19, 4, 385);
    			add_location(br4, file$a, 21, 8, 447);
    			attr_dev(div5, "class", "right svelte-xzsndc");
    			add_location(div5, file$a, 20, 4, 418);
    			attr_dev(div6, "class", "svelte-xzsndc");
    			add_location(div6, file$a, 18, 3, 374);
    			attr_dev(div7, "class", "left svelte-xzsndc");
    			add_location(div7, file$a, 26, 4, 519);
    			add_location(br5, file$a, 28, 8, 582);
    			attr_dev(div8, "class", "right svelte-xzsndc");
    			add_location(div8, file$a, 27, 4, 553);
    			attr_dev(div9, "class", "svelte-xzsndc");
    			add_location(div9, file$a, 25, 3, 508);
    			attr_dev(div10, "class", "footer_item svelte-xzsndc");
    			add_location(div10, file$a, 17, 2, 344);
    			attr_dev(div11, "class", "footer_item_container svelte-xzsndc");
    			add_location(div11, file$a, 4, 1, 46);
    			attr_dev(span, "class", "copyright svelte-xzsndc");
    			add_location(span, file$a, 35, 2, 687);
    			attr_dev(a0, "href", "http://cs.sogang.ac.kr");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-xzsndc");
    			add_location(a0, file$a, 37, 7, 763);
    			attr_dev(li0, "class", "svelte-xzsndc");
    			add_location(li0, file$a, 37, 3, 759);
    			attr_dev(a1, "href", "https://www.acmicpc.net/group/4963");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-xzsndc");
    			add_location(a1, file$a, 38, 7, 836);
    			attr_dev(li1, "class", "svelte-xzsndc");
    			add_location(li1, file$a, 38, 3, 832);
    			attr_dev(a2, "href", "https://solved.ac");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-xzsndc");
    			add_location(a2, file$a, 39, 7, 921);
    			attr_dev(li2, "class", "svelte-xzsndc");
    			add_location(li2, file$a, 39, 3, 917);
    			attr_dev(ul, "class", "svelte-xzsndc");
    			add_location(ul, file$a, 36, 2, 750);
    			attr_dev(img, "class", "footer_logo svelte-xzsndc");
    			if (img.src !== (img_src_value = "/res/logo-white.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Sogang ICPC Team");
    			add_location(img, file$a, 41, 2, 996);
    			attr_dev(div12, "class", "footer_desc svelte-xzsndc");
    			add_location(div12, file$a, 34, 1, 658);
    			attr_dev(div13, "class", "footer svelte-xzsndc");
    			add_location(div13, file$a, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div11);
    			append_dev(div11, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div1, br0);
    			append_dev(div1, t3);
    			append_dev(div1, br1);
    			append_dev(div1, t4);
    			append_dev(div1, br2);
    			append_dev(div1, t5);
    			append_dev(div1, br3);
    			append_dev(div1, t6);
    			append_dev(div11, t7);
    			append_dev(div11, div10);
    			append_dev(div10, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			append_dev(div5, t10);
    			append_dev(div5, br4);
    			append_dev(div5, t11);
    			append_dev(div10, t12);
    			append_dev(div10, div9);
    			append_dev(div9, div7);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			append_dev(div8, t15);
    			append_dev(div8, br5);
    			append_dev(div8, t16);
    			append_dev(div13, t17);
    			append_dev(div13, div12);
    			append_dev(div12, span);
    			append_dev(div12, t19);
    			append_dev(div12, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t21);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t23);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(div12, t25);
    			append_dev(div12, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\routes\Home.svelte generated by Svelte v3.34.0 */
    const file$9 = "src\\routes\\Home.svelte";

    function create_fragment$9(ctx) {
    	let div17;
    	let div1;
    	let div0;
    	let t0;
    	let br0;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let br1;
    	let t4;
    	let br2;
    	let t5;
    	let img;
    	let img_src_value;
    	let t6;
    	let div4;
    	let div2;
    	let h20;
    	let t8;
    	let div3;
    	let h10;
    	let t9;
    	let a0;
    	let i0;
    	let t11;
    	let div5;
    	let t12;
    	let div8;
    	let div6;
    	let h21;
    	let t14;
    	let div7;
    	let h11;
    	let t15;
    	let a1;
    	let i1;
    	let t17;
    	let div9;
    	let t18;
    	let div12;
    	let div10;
    	let h22;
    	let t20;
    	let div11;
    	let h12;
    	let t21;
    	let a2;
    	let i2;
    	let t23;
    	let div13;
    	let t24;
    	let div16;
    	let div14;
    	let h23;
    	let t26;
    	let div15;
    	let h13;
    	let t27;
    	let a3;
    	let i3;

    	const block = {
    		c: function create() {
    			div17 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Make it.");
    			br0 = element("br");
    			t1 = text("\r\n\t\t\tSolve it.");
    			t2 = space();
    			p = element("p");
    			t3 = text("Sogang ICPC Team —");
    			br1 = element("br");
    			t4 = text("\r\n\t\t\t서강대학교 컴퓨터공학과 알고리즘 문제해결 학회");
    			br2 = element("br");
    			t5 = space();
    			img = element("img");
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "소개";
    			t8 = space();
    			div3 = element("div");
    			h10 = element("h1");
    			t9 = text("우리는 알고리즘을 공부하고, 알고리즘으로 문제를 해결합니다. ");
    			a0 = element("a");
    			i0 = element("i");
    			i0.textContent = "arrow_forward";
    			t11 = space();
    			div5 = element("div");
    			t12 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h21 = element("h2");
    			h21.textContent = "기록";
    			t14 = space();
    			div7 = element("div");
    			h11 = element("h1");
    			t15 = text("매년 여러 대회에 참가해 우수한 성적을 거두고 있습니다. ");
    			a1 = element("a");
    			i1 = element("i");
    			i1.textContent = "arrow_forward";
    			t17 = space();
    			div9 = element("div");
    			t18 = space();
    			div12 = element("div");
    			div10 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Sogang Programming Contest";
    			t20 = space();
    			div11 = element("div");
    			h12 = element("h1");
    			t21 = text("논리력과 문제 해결 능력을 겨루는 대회입니다. ");
    			a2 = element("a");
    			i2 = element("i");
    			i2.textContent = "arrow_forward";
    			t23 = space();
    			div13 = element("div");
    			t24 = space();
    			div16 = element("div");
    			div14 = element("div");
    			h23 = element("h2");
    			h23.textContent = "가입 및 문의";
    			t26 = space();
    			div15 = element("div");
    			h13 = element("h1");
    			t27 = text("서강대학교 학부생이라면 누구나 함께할 수 있습니다. ");
    			a3 = element("a");
    			i3 = element("i");
    			i3.textContent = "arrow_forward";
    			add_location(br0, file$9, 12, 11, 248);
    			attr_dev(div0, "class", "main_title text");
    			add_location(div0, file$9, 11, 2, 206);
    			add_location(br1, file$9, 16, 21, 331);
    			add_location(br2, file$9, 17, 28, 367);
    			attr_dev(p, "class", "main_desc text");
    			add_location(p, file$9, 15, 2, 282);
    			attr_dev(div1, "class", "pad");
    			add_location(div1, file$9, 10, 1, 185);
    			attr_dev(img, "class", "pad");
    			if (img.src !== (img_src_value = "/res/icpc2019-yongukgoarmy.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$9, 32, 1, 849);
    			add_location(h20, file$9, 35, 3, 962);
    			attr_dev(div2, "class", "p25");
    			add_location(div2, file$9, 34, 2, 940);
    			attr_dev(i0, "class", "material-icons main");
    			add_location(i0, file$9, 40, 6, 1084);
    			attr_dev(a0, "href", "/introduction");
    			add_location(a0, file$9, 39, 38, 1053);
    			add_location(h10, file$9, 38, 3, 1009);
    			attr_dev(div3, "class", "p75");
    			add_location(div3, file$9, 37, 2, 987);
    			attr_dev(div4, "class", "row pad");
    			add_location(div4, file$9, 33, 1, 915);
    			attr_dev(div5, "class", "hr");
    			add_location(div5, file$9, 45, 1, 1174);
    			add_location(h21, file$9, 48, 3, 1242);
    			attr_dev(div6, "class", "p25");
    			add_location(div6, file$9, 47, 2, 1220);
    			attr_dev(i1, "class", "material-icons main");
    			add_location(i1, file$9, 53, 6, 1357);
    			attr_dev(a1, "href", "/history");
    			add_location(a1, file$9, 52, 36, 1331);
    			add_location(h11, file$9, 51, 3, 1289);
    			attr_dev(div7, "class", "p75");
    			add_location(div7, file$9, 50, 2, 1267);
    			attr_dev(div8, "class", "row pad");
    			add_location(div8, file$9, 46, 1, 1195);
    			attr_dev(div9, "class", "hr");
    			add_location(div9, file$9, 58, 1, 1447);
    			add_location(h22, file$9, 61, 3, 1515);
    			attr_dev(div10, "class", "p25");
    			add_location(div10, file$9, 60, 2, 1493);
    			attr_dev(i2, "class", "material-icons main");
    			add_location(i2, file$9, 66, 6, 1644);
    			attr_dev(a2, "href", "/spc");
    			add_location(a2, file$9, 65, 30, 1622);
    			add_location(h12, file$9, 64, 3, 1586);
    			attr_dev(div11, "class", "p75");
    			add_location(div11, file$9, 63, 2, 1564);
    			attr_dev(div12, "class", "row pad");
    			add_location(div12, file$9, 59, 1, 1468);
    			attr_dev(div13, "class", "hr");
    			add_location(div13, file$9, 71, 1, 1734);
    			add_location(h23, file$9, 74, 3, 1802);
    			attr_dev(div14, "class", "p25");
    			add_location(div14, file$9, 73, 2, 1780);
    			attr_dev(i3, "class", "material-icons main");
    			add_location(i3, file$9, 79, 6, 1919);
    			attr_dev(a3, "href", "/contact");
    			add_location(a3, file$9, 78, 33, 1893);
    			add_location(h13, file$9, 77, 3, 1854);
    			attr_dev(div15, "class", "p75");
    			add_location(div15, file$9, 76, 2, 1832);
    			attr_dev(div16, "class", "row pad");
    			add_location(div16, file$9, 72, 1, 1755);
    			attr_dev(div17, "class", "contents");
    			add_location(div17, file$9, 9, 0, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, br0);
    			append_dev(div0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(p, br1);
    			append_dev(p, t4);
    			append_dev(p, br2);
    			append_dev(div17, t5);
    			append_dev(div17, img);
    			append_dev(div17, t6);
    			append_dev(div17, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h20);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, h10);
    			append_dev(h10, t9);
    			append_dev(h10, a0);
    			append_dev(a0, i0);
    			append_dev(div17, t11);
    			append_dev(div17, div5);
    			append_dev(div17, t12);
    			append_dev(div17, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h21);
    			append_dev(div8, t14);
    			append_dev(div8, div7);
    			append_dev(div7, h11);
    			append_dev(h11, t15);
    			append_dev(h11, a1);
    			append_dev(a1, i1);
    			append_dev(div17, t17);
    			append_dev(div17, div9);
    			append_dev(div17, t18);
    			append_dev(div17, div12);
    			append_dev(div12, div10);
    			append_dev(div10, h22);
    			append_dev(div12, t20);
    			append_dev(div12, div11);
    			append_dev(div11, h12);
    			append_dev(h12, t21);
    			append_dev(h12, a2);
    			append_dev(a2, i2);
    			append_dev(div17, t23);
    			append_dev(div17, div13);
    			append_dev(div17, t24);
    			append_dev(div17, div16);
    			append_dev(div16, div14);
    			append_dev(div14, h23);
    			append_dev(div16, t26);
    			append_dev(div16, div15);
    			append_dev(div15, h13);
    			append_dev(h13, t27);
    			append_dev(h13, a3);
    			append_dev(a3, i3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div17);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);

    	onMount(() => {
    		document.body.scrollTop = 0;
    		document.documentElement.scrollTop = 0;
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\template\HistoryTable\HistoryTable.svelte generated by Svelte v3.34.0 */

    const file$8 = "src\\template\\HistoryTable\\HistoryTable.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (20:6) {#each thead as data}
    function create_each_block_3(ctx) {
    	let th;
    	let t_value = /*data*/ ctx[10] + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			add_location(th, file$8, 20, 7, 463);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*thead*/ 4 && t_value !== (t_value = /*data*/ ctx[10] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(20:6) {#each thead as data}",
    		ctx
    	});

    	return block;
    }

    // (41:8) {:else}
    function create_else_block$1(ctx) {
    	let td;
    	let t_value = /*col*/ ctx[13] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$8, 41, 9, 1095);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tbody*/ 8 && t_value !== (t_value = /*col*/ ctx[13] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(41:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:8) {#if idx2 === 0}
    function create_if_block_2$1(ctx) {
    	let td;
    	let t_value = /*col*/ ctx[13] + "";
    	let t;
    	let i;
    	let i_class_value;

    	function select_block_type_1(ctx, dirty) {
    		if (/*award*/ ctx[1][/*idx1*/ ctx[12]] === "gold" || /*award*/ ctx[1][/*idx1*/ ctx[12]] === "silver" || /*award*/ ctx[1][/*idx1*/ ctx[12]] === "bronze" || /*award*/ ctx[1][/*idx1*/ ctx[12]] === "special") return create_if_block_3$1;
    		if (/*award*/ ctx[1][/*idx1*/ ctx[12]] === "winner") return create_if_block_4$1;
    		if (/*award*/ ctx[1][/*idx1*/ ctx[12]] === "advanced") return create_if_block_5$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			i = element("i");
    			if (if_block) if_block.c();
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(`award ${/*award*/ ctx[1][/*idx1*/ ctx[12]]}`) + " svelte-2o2gn6"));
    			add_location(i, file$8, 30, 16, 695);
    			attr_dev(td, "class", "ranking--wrapper svelte-2o2gn6");
    			add_location(td, file$8, 29, 9, 649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    			append_dev(td, i);
    			if (if_block) if_block.m(i, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tbody*/ 8 && t_value !== (t_value = /*col*/ ctx[13] + "")) set_data_dev(t, t_value);

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(i, null);
    				}
    			}

    			if (dirty & /*award*/ 2 && i_class_value !== (i_class_value = "" + (null_to_empty(`award ${/*award*/ ctx[1][/*idx1*/ ctx[12]]}`) + " svelte-2o2gn6"))) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(29:8) {#if idx2 === 0}",
    		ctx
    	});

    	return block;
    }

    // (36:48) 
    function create_if_block_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("▲");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(36:48) ",
    		ctx
    	});

    	return block;
    }

    // (34:46) 
    function create_if_block_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("★");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(34:46) ",
    		ctx
    	});

    	return block;
    }

    // (32:11) {#if award[idx1] === 'gold' || award[idx1] === 'silver' || award[idx1] === 'bronze' || award[idx1] === 'special'}
    function create_if_block_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("⬤");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(32:11) {#if award[idx1] === 'gold' || award[idx1] === 'silver' || award[idx1] === 'bronze' || award[idx1] === 'special'}",
    		ctx
    	});

    	return block;
    }

    // (28:7) {#each data as col, idx2}
    function create_each_block_2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*idx2*/ ctx[15] === 0) return create_if_block_2$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(28:7) {#each data as col, idx2}",
    		ctx
    	});

    	return block;
    }

    // (26:5) {#each tbody as data, idx1}
    function create_each_block_1(ctx) {
    	let tr;
    	let t;
    	let each_value_2 = /*data*/ ctx[10];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(tr, file$8, 26, 6, 574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*award, tbody*/ 10) {
    				each_value_2 = /*data*/ ctx[10];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(26:5) {#each tbody as data, idx1}",
    		ctx
    	});

    	return block;
    }

    // (52:3) {#if link}
    function create_if_block$4(ctx) {
    	let t;
    	let if_block_anchor;
    	let each_value = /*link*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	let if_block = /*isReviewAvail*/ ctx[5] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*link*/ 16) {
    				each_value = /*link*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*isReviewAvail*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(52:3) {#if link}",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#each link as elem}
    function create_each_block$5(ctx) {
    	let li;
    	let a;
    	let t_value = /*elem*/ ctx[7][0] + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*elem*/ ctx[7][1]);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$8, 53, 9, 1273);
    			add_location(li, file$8, 53, 5, 1269);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*link*/ 16 && t_value !== (t_value = /*elem*/ ctx[7][0] + "")) set_data_dev(t, t_value);

    			if (dirty & /*link*/ 16 && a_href_value !== (a_href_value = /*elem*/ ctx[7][1])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(53:4) {#each link as elem}",
    		ctx
    	});

    	return block;
    }

    // (56:4) {#if isReviewAvail}
    function create_if_block_1$2(ctx) {
    	let li;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "대회 후기";
    			attr_dev(li, "class", "review_table_btn svelte-2o2gn6");
    			add_location(li, file$8, 56, 5, 1370);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", /*onReviewClick*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(56:4) {#if isReviewAvail}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div3;
    	let div0;
    	let h2;
    	let t0;
    	let t1;
    	let div2;
    	let div1;
    	let table;
    	let thead_1;
    	let tr;
    	let t2;
    	let tbody_1;
    	let t3;
    	let p;
    	let t4;
    	let ul;
    	let each_value_3 = /*thead*/ ctx[2];
    	validate_each_argument(each_value_3);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_1 = /*tbody*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block = /*link*/ ctx[4] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			thead_1 = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			tbody_1 = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			p = element("p");
    			t4 = space();
    			ul = element("ul");
    			if (if_block) if_block.c();
    			add_location(h2, file$8, 12, 2, 311);
    			attr_dev(div0, "class", "p25");
    			add_location(div0, file$8, 11, 1, 290);
    			add_location(tr, file$8, 18, 6, 421);
    			add_location(thead_1, file$8, 17, 4, 407);
    			add_location(tbody_1, file$8, 24, 4, 525);
    			attr_dev(table, "class", "svelte-2o2gn6");
    			add_location(table, file$8, 16, 3, 394);
    			attr_dev(div1, "class", "table_container");
    			add_location(div1, file$8, 15, 2, 360);
    			add_location(p, file$8, 49, 2, 1208);
    			add_location(ul, file$8, 50, 2, 1217);
    			attr_dev(div2, "class", "p75");
    			add_location(div2, file$8, 14, 1, 339);
    			attr_dev(div3, "class", "" + (null_to_empty(`row pad`) + " svelte-2o2gn6"));
    			add_location(div3, file$8, 10, 0, 264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, thead_1);
    			append_dev(thead_1, tr);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t2);
    			append_dev(table, tbody_1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody_1, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, p);
    			append_dev(div2, t4);
    			append_dev(div2, ul);
    			if (if_block) if_block.m(ul, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (dirty & /*thead*/ 4) {
    				each_value_3 = /*thead*/ ctx[2];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_3.length;
    			}

    			if (dirty & /*tbody, award*/ 10) {
    				each_value_1 = /*tbody*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody_1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*link*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HistoryTable", slots, []);

    	let { title } = $$props,
    		{ award } = $$props,
    		{ thead } = $$props,
    		{ tbody } = $$props,
    		{ link } = $$props,
    		{ isReviewAvail } = $$props;

    	const onReviewClick = e => {
    		let nextElem = e.target.closest(".pad").nextElementSibling;
    		nextElem.classList.toggle("hide");
    		nextElem.classList.toggle("show");
    	};

    	const writable_props = ["title", "award", "thead", "tbody", "link", "isReviewAvail"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HistoryTable> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("award" in $$props) $$invalidate(1, award = $$props.award);
    		if ("thead" in $$props) $$invalidate(2, thead = $$props.thead);
    		if ("tbody" in $$props) $$invalidate(3, tbody = $$props.tbody);
    		if ("link" in $$props) $$invalidate(4, link = $$props.link);
    		if ("isReviewAvail" in $$props) $$invalidate(5, isReviewAvail = $$props.isReviewAvail);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		award,
    		thead,
    		tbody,
    		link,
    		isReviewAvail,
    		onReviewClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("award" in $$props) $$invalidate(1, award = $$props.award);
    		if ("thead" in $$props) $$invalidate(2, thead = $$props.thead);
    		if ("tbody" in $$props) $$invalidate(3, tbody = $$props.tbody);
    		if ("link" in $$props) $$invalidate(4, link = $$props.link);
    		if ("isReviewAvail" in $$props) $$invalidate(5, isReviewAvail = $$props.isReviewAvail);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, award, thead, tbody, link, isReviewAvail, onReviewClick];
    }

    class HistoryTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			title: 0,
    			award: 1,
    			thead: 2,
    			tbody: 3,
    			link: 4,
    			isReviewAvail: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HistoryTable",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<HistoryTable> was created without expected prop 'title'");
    		}

    		if (/*award*/ ctx[1] === undefined && !("award" in props)) {
    			console.warn("<HistoryTable> was created without expected prop 'award'");
    		}

    		if (/*thead*/ ctx[2] === undefined && !("thead" in props)) {
    			console.warn("<HistoryTable> was created without expected prop 'thead'");
    		}

    		if (/*tbody*/ ctx[3] === undefined && !("tbody" in props)) {
    			console.warn("<HistoryTable> was created without expected prop 'tbody'");
    		}

    		if (/*link*/ ctx[4] === undefined && !("link" in props)) {
    			console.warn("<HistoryTable> was created without expected prop 'link'");
    		}

    		if (/*isReviewAvail*/ ctx[5] === undefined && !("isReviewAvail" in props)) {
    			console.warn("<HistoryTable> was created without expected prop 'isReviewAvail'");
    		}
    	}

    	get title() {
    		throw new Error("<HistoryTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<HistoryTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get award() {
    		throw new Error("<HistoryTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set award(value) {
    		throw new Error("<HistoryTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thead() {
    		throw new Error("<HistoryTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thead(value) {
    		throw new Error("<HistoryTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tbody() {
    		throw new Error("<HistoryTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tbody(value) {
    		throw new Error("<HistoryTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<HistoryTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<HistoryTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReviewAvail() {
    		throw new Error("<HistoryTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReviewAvail(value) {
    		throw new Error("<HistoryTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\template\HistoryTab\HistoryTab.svelte generated by Svelte v3.34.0 */

    const file$7 = "src\\template\\HistoryTab\\HistoryTab.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (18:0) {#if yearsList}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*yearsList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*switchSelected, yearsList*/ 3) {
    				each_value = /*yearsList*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(18:0) {#if yearsList}",
    		ctx
    	});

    	return block;
    }

    // (19:1) {#each yearsList as data, idx}
    function create_each_block$4(ctx) {
    	let li;
    	let span;
    	let t0_value = /*data*/ ctx[3] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "tab_text");
    			add_location(span, file$7, 20, 3, 585);
    			attr_dev(li, "class", /*idx*/ ctx[5] == 0 ? "selected" : "");
    			add_location(li, file$7, 19, 2, 515);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", /*switchSelected*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yearsList*/ 1 && t0_value !== (t0_value = /*data*/ ctx[3] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(19:1) {#each yearsList as data, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;
    	let if_block = /*yearsList*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*yearsList*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HistoryTab", slots, []);
    	let { yearsList } = $$props, { curYear } = $$props;

    	const switchSelected = e => {
    		// Change curYear Value To Re-fetch Json
    		$$invalidate(2, curYear = e.target.textContent);

    		// Toggling Class
    		let ul = e.target.closest("li").parentElement;

    		ul.querySelectorAll("li").forEach(ele => {
    			if (ele !== e.target) ele.classList.remove("selected");
    		});

    		e.target.closest("li").classList.add("selected");
    	};

    	const writable_props = ["yearsList", "curYear"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HistoryTab> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("yearsList" in $$props) $$invalidate(0, yearsList = $$props.yearsList);
    		if ("curYear" in $$props) $$invalidate(2, curYear = $$props.curYear);
    	};

    	$$self.$capture_state = () => ({ yearsList, curYear, switchSelected });

    	$$self.$inject_state = $$props => {
    		if ("yearsList" in $$props) $$invalidate(0, yearsList = $$props.yearsList);
    		if ("curYear" in $$props) $$invalidate(2, curYear = $$props.curYear);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [yearsList, switchSelected, curYear];
    }

    class HistoryTab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { yearsList: 0, curYear: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HistoryTab",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*yearsList*/ ctx[0] === undefined && !("yearsList" in props)) {
    			console.warn("<HistoryTab> was created without expected prop 'yearsList'");
    		}

    		if (/*curYear*/ ctx[2] === undefined && !("curYear" in props)) {
    			console.warn("<HistoryTab> was created without expected prop 'curYear'");
    		}
    	}

    	get yearsList() {
    		throw new Error("<HistoryTab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yearsList(value) {
    		throw new Error("<HistoryTab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get curYear() {
    		throw new Error("<HistoryTab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set curYear(value) {
    		throw new Error("<HistoryTab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\template\OrganizerTable\OrganizerTable.svelte generated by Svelte v3.34.0 */

    const file$6 = "src\\template\\OrganizerTable\\OrganizerTable.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (20:1) {#if datas}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*datas*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datas*/ 1) {
    				each_value = /*datas*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(20:1) {#if datas}",
    		ctx
    	});

    	return block;
    }

    // (36:5) {:else}
    function create_else_block_1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(36:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:35) 
    function create_if_block_5(ctx) {
    	let a;
    	let t_value = /*data*/ ctx[1].president.link + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*data*/ ctx[1].president.link);
    			add_location(a, file$6, 34, 6, 794);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datas*/ 1 && t_value !== (t_value = /*data*/ ctx[1].president.link + "")) set_data_dev(t, t_value);

    			if (dirty & /*datas*/ 1 && a_href_value !== (a_href_value = /*data*/ ctx[1].president.link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(34:35) ",
    		ctx
    	});

    	return block;
    }

    // (32:5) {#if data.president.email}
    function create_if_block_4(ctx) {
    	let a;
    	let t_value = /*data*/ ctx[1].president.email + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = `mailto:${/*data*/ ctx[1].president.email}`);
    			add_location(a, file$6, 32, 6, 680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datas*/ 1 && t_value !== (t_value = /*data*/ ctx[1].president.email + "")) set_data_dev(t, t_value);

    			if (dirty & /*datas*/ 1 && a_href_value !== (a_href_value = `mailto:${/*data*/ ctx[1].president.email}`)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(32:5) {#if data.president.email}",
    		ctx
    	});

    	return block;
    }

    // (39:3) {#if data.vicePresident}
    function create_if_block_1$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*data*/ ctx[1].vicePresident.name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let a;
    	let t4_value = /*data*/ ctx[1].vicePresident.boj + "";
    	let t4;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6;

    	function select_block_type_1(ctx, dirty) {
    		if (/*data*/ ctx[1].vicePresident.email) return create_if_block_2;
    		if (/*data*/ ctx[1].vicePresident.link) return create_if_block_3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "부학회장";
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			if_block.c();
    			t6 = space();
    			add_location(td0, file$6, 40, 5, 935);
    			add_location(td1, file$6, 41, 5, 976);
    			attr_dev(a, "href", a_href_value = `https://www.acmicpc.net/user/${/*data*/ ctx[1].vicePresident.boj}`);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$6, 43, 6, 1008);
    			add_location(td2, file$6, 42, 5, 996);
    			add_location(td3, file$6, 47, 20, 1185);
    			add_location(tr, file$6, 39, 4, 924);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			if_block.m(td3, null);
    			append_dev(tr, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datas*/ 1 && t0_value !== (t0_value = /*data*/ ctx[1].vicePresident.name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*datas*/ 1 && t4_value !== (t4_value = /*data*/ ctx[1].vicePresident.boj + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*datas*/ 1 && a_href_value !== (a_href_value = `https://www.acmicpc.net/user/${/*data*/ ctx[1].vicePresident.boj}`)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td3, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(39:3) {#if data.vicePresident}",
    		ctx
    	});

    	return block;
    }

    // (53:6) {:else}
    function create_else_block(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(53:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:40) 
    function create_if_block_3(ctx) {
    	let a;
    	let t_value = /*data*/ ctx[1].vicePresident.link + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*data*/ ctx[1].vicePresident.link);
    			add_location(a, file$6, 51, 7, 1364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datas*/ 1 && t_value !== (t_value = /*data*/ ctx[1].vicePresident.link + "")) set_data_dev(t, t_value);

    			if (dirty & /*datas*/ 1 && a_href_value !== (a_href_value = /*data*/ ctx[1].vicePresident.link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(51:40) ",
    		ctx
    	});

    	return block;
    }

    // (49:6) {#if data.vicePresident.email}
    function create_if_block_2(ctx) {
    	let a;
    	let t_value = /*data*/ ctx[1].vicePresident.email + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = `mailto:${/*data*/ ctx[1].vicePresident.email}`);
    			add_location(a, file$6, 49, 7, 1236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datas*/ 1 && t_value !== (t_value = /*data*/ ctx[1].vicePresident.email + "")) set_data_dev(t, t_value);

    			if (dirty & /*datas*/ 1 && a_href_value !== (a_href_value = `mailto:${/*data*/ ctx[1].vicePresident.email}`)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(49:6) {#if data.vicePresident.email}",
    		ctx
    	});

    	return block;
    }

    // (21:2) {#each datas as data}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let b;
    	let raw_value = /*data*/ ctx[1].year + "";
    	let td0_rowspan_value;
    	let t0;
    	let td1;
    	let t1_value = /*data*/ ctx[1].president.name + "";
    	let t1;
    	let t2;
    	let td2;
    	let t4;
    	let td3;
    	let a;
    	let t5_value = /*data*/ ctx[1].president.boj + "";
    	let t5;
    	let a_href_value;
    	let t6;
    	let td4;
    	let t7;
    	let if_block1_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*data*/ ctx[1].president.email) return create_if_block_4;
    		if (/*data*/ ctx[1].president.link) return create_if_block_5;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*data*/ ctx[1].vicePresident && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			b = element("b");
    			t0 = space();
    			td1 = element("td");
    			t1 = text(t1_value);
    			t2 = space();
    			td2 = element("td");
    			td2.textContent = "학회장";
    			t4 = space();
    			td3 = element("td");
    			a = element("a");
    			t5 = text(t5_value);
    			t6 = space();
    			td4 = element("td");
    			if_block0.c();
    			t7 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			add_location(b, file$6, 22, 48, 400);
    			attr_dev(td0, "rowspan", td0_rowspan_value = /*data*/ ctx[1].vicePresident ? "2" : "");
    			add_location(td0, file$6, 22, 4, 356);
    			add_location(td1, file$6, 23, 4, 435);
    			add_location(td2, file$6, 24, 4, 471);
    			attr_dev(a, "href", a_href_value = `https://www.acmicpc.net/user/${/*data*/ ctx[1].president.boj}`);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$6, 26, 6, 500);
    			add_location(td3, file$6, 25, 4, 489);
    			add_location(td4, file$6, 30, 4, 635);
    			add_location(tr, file$6, 21, 3, 346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, b);
    			b.innerHTML = raw_value;
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, a);
    			append_dev(a, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			if_block0.m(td4, null);
    			insert_dev(target, t7, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datas*/ 1 && raw_value !== (raw_value = /*data*/ ctx[1].year + "")) b.innerHTML = raw_value;
    			if (dirty & /*datas*/ 1 && td0_rowspan_value !== (td0_rowspan_value = /*data*/ ctx[1].vicePresident ? "2" : "")) {
    				attr_dev(td0, "rowspan", td0_rowspan_value);
    			}

    			if (dirty & /*datas*/ 1 && t1_value !== (t1_value = /*data*/ ctx[1].president.name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*datas*/ 1 && t5_value !== (t5_value = /*data*/ ctx[1].president.boj + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*datas*/ 1 && a_href_value !== (a_href_value = `https://www.acmicpc.net/user/${/*data*/ ctx[1].president.boj}`)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(td4, null);
    				}
    			}

    			if (/*data*/ ctx[1].vicePresident) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block0.d();
    			if (detaching) detach_dev(t7);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(21:2) {#each datas as data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let table;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let if_block = /*datas*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "연도";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "이름";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "직책";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "BOJ 핸들";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "비고";
    			t9 = space();
    			if (if_block) if_block.c();
    			add_location(th0, file$6, 13, 2, 219);
    			add_location(th1, file$6, 14, 2, 234);
    			add_location(th2, file$6, 15, 2, 249);
    			add_location(th3, file$6, 16, 2, 264);
    			add_location(th4, file$6, 17, 2, 283);
    			add_location(tr, file$6, 12, 1, 211);
    			set_style(table, "min-width", "800px");
    			add_location(table, file$6, 11, 0, 176);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(table, t9);
    			if (if_block) if_block.m(table, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*datas*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(table, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("OrganizerTable", slots, []);
    	let datas;

    	fetch("/history/organizer.json").then(response => {
    		return response.json();
    	}).then(data => {
    		$$invalidate(0, datas = data);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<OrganizerTable> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ datas });

    	$$self.$inject_state = $$props => {
    		if ("datas" in $$props) $$invalidate(0, datas = $$props.datas);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [datas];
    }

    class OrganizerTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OrganizerTable",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\template\ReviewTable\ReviewTable.svelte generated by Svelte v3.34.0 */

    const file$5 = "src\\template\\ReviewTable\\ReviewTable.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (18:5) {#each tbody as data, idx1}
    function create_each_block$2(ctx) {
    	let tr;
    	let td;
    	let a;
    	let t0_value = /*data*/ ctx[2][0] + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*data*/ ctx[2][1]);
    			add_location(a, file$5, 19, 11, 346);
    			add_location(td, file$5, 19, 7, 342);
    			add_location(tr, file$5, 18, 6, 329);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tbody*/ 2 && t0_value !== (t0_value = /*data*/ ctx[2][0] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*tbody*/ 2 && a_href_value !== (a_href_value = /*data*/ ctx[2][1])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(18:5) {#each tbody as data, idx1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div3;
    	let div0;
    	let h2;
    	let t0;
    	let t1;
    	let div2;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let th;
    	let t3;
    	let tbody_1;
    	let t4;
    	let p;
    	let each_value = /*tbody*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th = element("th");
    			th.textContent = "링크";
    			t3 = space();
    			tbody_1 = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			p = element("p");
    			add_location(h2, file$5, 6, 2, 115);
    			attr_dev(div0, "class", "p25");
    			add_location(div0, file$5, 5, 1, 94);
    			add_location(th, file$5, 13, 6, 237);
    			add_location(tr, file$5, 12, 6, 225);
    			add_location(thead, file$5, 11, 4, 211);
    			add_location(tbody_1, file$5, 16, 4, 280);
    			add_location(table, file$5, 10, 3, 198);
    			attr_dev(div1, "class", "table_container");
    			add_location(div1, file$5, 9, 2, 164);
    			add_location(p, file$5, 25, 2, 450);
    			attr_dev(div2, "class", "p75");
    			add_location(div2, file$5, 8, 1, 143);
    			attr_dev(div3, "class", "" + (null_to_empty(`row pad review_table hide`) + " svelte-dwttpr"));
    			add_location(div3, file$5, 4, 0, 50);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th);
    			append_dev(table, t3);
    			append_dev(table, tbody_1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody_1, null);
    			}

    			append_dev(div2, t4);
    			append_dev(div2, p);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (dirty & /*tbody*/ 2) {
    				each_value = /*tbody*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody_1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ReviewTable", slots, []);
    	let { title } = $$props, { tbody } = $$props;
    	const writable_props = ["title", "tbody"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ReviewTable> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("tbody" in $$props) $$invalidate(1, tbody = $$props.tbody);
    	};

    	$$self.$capture_state = () => ({ title, tbody });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("tbody" in $$props) $$invalidate(1, tbody = $$props.tbody);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, tbody];
    }

    class ReviewTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { title: 0, tbody: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReviewTable",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<ReviewTable> was created without expected prop 'title'");
    		}

    		if (/*tbody*/ ctx[1] === undefined && !("tbody" in props)) {
    			console.warn("<ReviewTable> was created without expected prop 'tbody'");
    		}
    	}

    	get title() {
    		throw new Error("<ReviewTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ReviewTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tbody() {
    		throw new Error("<ReviewTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tbody(value) {
    		throw new Error("<ReviewTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\History\History.svelte generated by Svelte v3.34.0 */
    const file$4 = "src\\routes\\History\\History.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (51:2) {#if history}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*history*/ ctx[2].contests;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*history*/ 4) {
    				each_value = /*history*/ ctx[2].contests;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(51:2) {#if history}",
    		ctx
    	});

    	return block;
    }

    // (61:4) {#if contest.review}
    function create_if_block_1(ctx) {
    	let reviewtable;
    	let current;

    	reviewtable = new ReviewTable({
    			props: {
    				title: "대회 후기",
    				tbody: /*contest*/ ctx[4].review
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(reviewtable.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(reviewtable, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const reviewtable_changes = {};
    			if (dirty & /*history*/ 4) reviewtable_changes.tbody = /*contest*/ ctx[4].review;
    			reviewtable.$set(reviewtable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(reviewtable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(reviewtable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(reviewtable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(61:4) {#if contest.review}",
    		ctx
    	});

    	return block;
    }

    // (52:3) {#each history.contests as contest}
    function create_each_block$1(ctx) {
    	let historytable;
    	let t;
    	let if_block_anchor;
    	let current;

    	historytable = new HistoryTable({
    			props: {
    				title: /*contest*/ ctx[4].title,
    				award: /*contest*/ ctx[4].award,
    				thead: /*contest*/ ctx[4].columns,
    				tbody: /*contest*/ ctx[4].data,
    				link: /*contest*/ ctx[4].links,
    				isReviewAvail: /*contest*/ ctx[4].review ? true : false
    			},
    			$$inline: true
    		});

    	let if_block = /*contest*/ ctx[4].review && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			create_component(historytable.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(historytable, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const historytable_changes = {};
    			if (dirty & /*history*/ 4) historytable_changes.title = /*contest*/ ctx[4].title;
    			if (dirty & /*history*/ 4) historytable_changes.award = /*contest*/ ctx[4].award;
    			if (dirty & /*history*/ 4) historytable_changes.thead = /*contest*/ ctx[4].columns;
    			if (dirty & /*history*/ 4) historytable_changes.tbody = /*contest*/ ctx[4].data;
    			if (dirty & /*history*/ 4) historytable_changes.link = /*contest*/ ctx[4].links;
    			if (dirty & /*history*/ 4) historytable_changes.isReviewAvail = /*contest*/ ctx[4].review ? true : false;
    			historytable.$set(historytable_changes);

    			if (/*contest*/ ctx[4].review) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*history*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(historytable.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(historytable.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(historytable, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(52:3) {#each history.contests as contest}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div7;
    	let div0;
    	let span;
    	let t1;
    	let h1;
    	let t3;
    	let img;
    	let img_src_value;
    	let t4;
    	let div3;
    	let div1;
    	let h20;
    	let t6;
    	let div2;
    	let ul;
    	let historytab;
    	let updating_curYear;
    	let t7;
    	let div4;
    	let t8;
    	let div5;
    	let t9;
    	let div6;
    	let b0;
    	let t11;
    	let b1;
    	let t13;
    	let br0;
    	let t14;
    	let i0;
    	let t16;
    	let i1;
    	let t18;
    	let i2;
    	let t20;
    	let i3;
    	let t22;
    	let br1;
    	let t23;
    	let i4;
    	let t25;
    	let br2;
    	let t26;
    	let i5;
    	let t28;
    	let br3;
    	let t29;
    	let br4;
    	let t30;
    	let t31;
    	let div8;
    	let t32;
    	let div12;
    	let div9;
    	let h21;
    	let t34;
    	let div11;
    	let div10;
    	let organizertable;
    	let t35;
    	let p;
    	let current;

    	function historytab_curYear_binding(value) {
    		/*historytab_curYear_binding*/ ctx[3](value);
    	}

    	let historytab_props = { yearsList: /*yearsList*/ ctx[1] };

    	if (/*curYear*/ ctx[0] !== void 0) {
    		historytab_props.curYear = /*curYear*/ ctx[0];
    	}

    	historytab = new HistoryTab({ props: historytab_props, $$inline: true });
    	binding_callbacks.push(() => bind(historytab, "curYear", historytab_curYear_binding));
    	let if_block = /*history*/ ctx[2] && create_if_block$1(ctx);
    	organizertable = new OrganizerTable({ $$inline: true });

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "기록";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "매년 여러 대회에 참가해 우수한 성적을 거두고 있습니다.";
    			t3 = space();
    			img = element("img");
    			t4 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "필터";
    			t6 = space();
    			div2 = element("div");
    			ul = element("ul");
    			create_component(historytab.$$.fragment);
    			t7 = space();
    			div4 = element("div");
    			if (if_block) if_block.c();
    			t8 = space();
    			div5 = element("div");
    			t9 = space();
    			div6 = element("div");
    			b0 = element("b");
    			b0.textContent = "#";
    			t11 = text(" = 순위, ");
    			b1 = element("b");
    			b1.textContent = "=";
    			t13 = text(" = 푼 문제 수 / 점수");
    			br0 = element("br");
    			t14 = space();
    			i0 = element("i");
    			i0.textContent = "★";
    			t16 = text(" = 우승,\r\n\t\t");
    			i1 = element("i");
    			i1.textContent = "⬤";
    			t18 = text(" = 금상,\r\n\t\t");
    			i2 = element("i");
    			i2.textContent = "⬤";
    			t20 = text(" = 은상,\r\n\t\t");
    			i3 = element("i");
    			i3.textContent = "⬤";
    			t22 = text(" = 동상");
    			br1 = element("br");
    			t23 = space();
    			i4 = element("i");
    			i4.textContent = "⬤";
    			t25 = text(" = 기타 수상");
    			br2 = element("br");
    			t26 = space();
    			i5 = element("i");
    			i5.textContent = "▲";
    			t28 = text(" = 다음 단계 진출");
    			br3 = element("br");
    			t29 = text("\r\n\t\tHM = Honorable Mention");
    			br4 = element("br");
    			t30 = text("\r\n\t\t2019년 이전의 정보는 완전하지 않을 수 있습니다. 정보 등록/수정 요청은 하단의 학회장 메일로 메일을 보내 주세요.");
    			t31 = space();
    			div8 = element("div");
    			t32 = space();
    			div12 = element("div");
    			div9 = element("div");
    			h21 = element("h2");
    			h21.textContent = "역대 스탭";
    			t34 = space();
    			div11 = element("div");
    			div10 = element("div");
    			create_component(organizertable.$$.fragment);
    			t35 = space();
    			p = element("p");
    			p.textContent = "2018년 이전의 정보는 완전하지 않을 수 있습니다. 정보 등록/수정 요청은 하단의 학회장 메일로 메일을 보내\r\n\t\t\t주세요.";
    			attr_dev(span, "class", "subtitle");
    			add_location(span, file$4, 35, 2, 913);
    			add_location(h1, file$4, 36, 2, 949);
    			attr_dev(div0, "class", "pad");
    			add_location(div0, file$4, 34, 1, 892);
    			attr_dev(img, "class", "pad");
    			if (img.src !== (img_src_value = "/res/scoreboard.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "2018 Sogang Programming Contest scoreboard");
    			add_location(img, file$4, 38, 1, 1001);
    			add_location(h20, file$4, 41, 3, 1145);
    			attr_dev(div1, "class", "pad_h");
    			add_location(div1, file$4, 40, 2, 1121);
    			attr_dev(ul, "class", "tabs pad_h");
    			add_location(ul, file$4, 44, 3, 1203);
    			attr_dev(div2, "class", "tabs_container");
    			add_location(div2, file$4, 43, 2, 1170);
    			attr_dev(div3, "class", "pad_v");
    			add_location(div3, file$4, 39, 1, 1098);
    			attr_dev(div4, "class", "history_contents");
    			add_location(div4, file$4, 49, 1, 1303);
    			attr_dev(div5, "class", "hr");
    			add_location(div5, file$4, 66, 1, 1740);
    			add_location(b0, file$4, 68, 2, 1782);
    			add_location(b1, file$4, 68, 17, 1797);
    			add_location(br0, file$4, 68, 39, 1819);
    			attr_dev(i0, "class", "award winner");
    			add_location(i0, file$4, 69, 2, 1829);
    			attr_dev(i1, "class", "award gold");
    			add_location(i1, file$4, 70, 2, 1874);
    			attr_dev(i2, "class", "award silver");
    			add_location(i2, file$4, 71, 2, 1918);
    			attr_dev(i3, "class", "award bronze");
    			add_location(i3, file$4, 72, 2, 1964);
    			add_location(br1, file$4, 72, 43, 2005);
    			attr_dev(i4, "class", "award special");
    			add_location(i4, file$4, 73, 2, 2015);
    			add_location(br2, file$4, 73, 47, 2060);
    			attr_dev(i5, "class", "award advanced");
    			add_location(i5, file$4, 74, 2, 2070);
    			add_location(br3, file$4, 74, 50, 2118);
    			add_location(br4, file$4, 75, 24, 2150);
    			attr_dev(div6, "class", "pad");
    			add_location(div6, file$4, 67, 1, 1761);
    			attr_dev(div7, "class", "contents");
    			add_location(div7, file$4, 33, 0, 867);
    			attr_dev(div8, "class", "hr");
    			add_location(div8, file$4, 79, 0, 2245);
    			add_location(h21, file$4, 82, 2, 2310);
    			attr_dev(div9, "class", "p25");
    			add_location(div9, file$4, 81, 1, 2289);
    			attr_dev(div10, "class", "table_container");
    			add_location(div10, file$4, 85, 2, 2357);
    			set_style(p, "margin-top", "16px");
    			add_location(p, file$4, 88, 2, 2423);
    			attr_dev(div11, "class", "p75");
    			add_location(div11, file$4, 84, 1, 2336);
    			attr_dev(div12, "class", "row pad");
    			add_location(div12, file$4, 80, 0, 2265);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, h1);
    			append_dev(div7, t3);
    			append_dev(div7, img);
    			append_dev(div7, t4);
    			append_dev(div7, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h20);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, ul);
    			mount_component(historytab, ul, null);
    			append_dev(div7, t7);
    			append_dev(div7, div4);
    			if (if_block) if_block.m(div4, null);
    			append_dev(div7, t8);
    			append_dev(div7, div5);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, b0);
    			append_dev(div6, t11);
    			append_dev(div6, b1);
    			append_dev(div6, t13);
    			append_dev(div6, br0);
    			append_dev(div6, t14);
    			append_dev(div6, i0);
    			append_dev(div6, t16);
    			append_dev(div6, i1);
    			append_dev(div6, t18);
    			append_dev(div6, i2);
    			append_dev(div6, t20);
    			append_dev(div6, i3);
    			append_dev(div6, t22);
    			append_dev(div6, br1);
    			append_dev(div6, t23);
    			append_dev(div6, i4);
    			append_dev(div6, t25);
    			append_dev(div6, br2);
    			append_dev(div6, t26);
    			append_dev(div6, i5);
    			append_dev(div6, t28);
    			append_dev(div6, br3);
    			append_dev(div6, t29);
    			append_dev(div6, br4);
    			append_dev(div6, t30);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, div8, anchor);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div9);
    			append_dev(div9, h21);
    			append_dev(div12, t34);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			mount_component(organizertable, div10, null);
    			append_dev(div11, t35);
    			append_dev(div11, p);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const historytab_changes = {};
    			if (dirty & /*yearsList*/ 2) historytab_changes.yearsList = /*yearsList*/ ctx[1];

    			if (!updating_curYear && dirty & /*curYear*/ 1) {
    				updating_curYear = true;
    				historytab_changes.curYear = /*curYear*/ ctx[0];
    				add_flush_callback(() => updating_curYear = false);
    			}

    			historytab.$set(historytab_changes);

    			if (/*history*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*history*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div4, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(historytab.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(organizertable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(historytab.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(organizertable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(historytab);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(div12);
    			destroy_component(organizertable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("History", slots, []);
    	let yearsList, history, curYear = `2021`;

    	fetch(`/history/data/years.json`).then(res => {
    		return res.json();
    	}).then(data => {
    		$$invalidate(1, yearsList = data);
    	});

    	onMount(() => {
    		document.body.scrollTop = 0;
    		document.documentElement.scrollTop = 0;
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<History> was created with unknown prop '${key}'`);
    	});

    	function historytab_curYear_binding(value) {
    		curYear = value;
    		$$invalidate(0, curYear);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		HistoryTable,
    		HistoryTab,
    		OrganizerTable,
    		ReviewTable,
    		yearsList,
    		history,
    		curYear
    	});

    	$$self.$inject_state = $$props => {
    		if ("yearsList" in $$props) $$invalidate(1, yearsList = $$props.yearsList);
    		if ("history" in $$props) $$invalidate(2, history = $$props.history);
    		if ("curYear" in $$props) $$invalidate(0, curYear = $$props.curYear);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*curYear*/ 1) {
    			// Re-fetch Whenever curYear Changes In HistoryTab Component
    			fetch(`/history/data/${curYear.trim()}.json`).then(res => {
    				return res.json();
    			}).then(data => {
    				$$invalidate(2, history = data);
    			});
    		}
    	};

    	return [curYear, yearsList, history, historytab_curYear_binding];
    }

    class History extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "History",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\routes\Spc\Spc.svelte generated by Svelte v3.34.0 */
    const file$3 = "src\\routes\\Spc\\Spc.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (424:2) {#if spcData}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*spcData*/ ctx[1].contests;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*spcData*/ 2) {
    				each_value = /*spcData*/ ctx[1].contests;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(424:2) {#if spcData}",
    		ctx
    	});

    	return block;
    }

    // (425:3) {#each spcData.contests as contest}
    function create_each_block(ctx) {
    	let historytable;
    	let current;

    	historytable = new HistoryTable({
    			props: {
    				title: /*contest*/ ctx[4].title,
    				award: /*contest*/ ctx[4].award,
    				thead: ["#", "=", "이름"],
    				tbody: /*contest*/ ctx[4].data
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(historytable.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(historytable, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const historytable_changes = {};
    			if (dirty & /*spcData*/ 2) historytable_changes.title = /*contest*/ ctx[4].title;
    			if (dirty & /*spcData*/ 2) historytable_changes.award = /*contest*/ ctx[4].award;
    			if (dirty & /*spcData*/ 2) historytable_changes.tbody = /*contest*/ ctx[4].data;
    			historytable.$set(historytable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(historytable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(historytable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(historytable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(425:3) {#each spcData.contests as contest}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div104;
    	let div0;
    	let span0;
    	let t1;
    	let h1;
    	let t3;
    	let div3;
    	let div1;
    	let h20;
    	let t5;
    	let div2;
    	let t7;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let div6;
    	let div4;
    	let h21;
    	let t10;
    	let div5;
    	let p0;
    	let t12;
    	let p1;
    	let t14;
    	let div7;
    	let t15;
    	let div10;
    	let div8;
    	let h22;
    	let t17;
    	let div9;
    	let p2;
    	let t19;
    	let div13;
    	let div11;
    	let h23;
    	let t21;
    	let div12;
    	let p3;
    	let t22;
    	let b0;
    	let t24;
    	let t25;
    	let p4;
    	let t26;
    	let i0;
    	let t28;
    	let i1;
    	let t30;
    	let i2;
    	let t32;
    	let i3;
    	let t34;
    	let t35;
    	let p5;
    	let t37;
    	let p6;
    	let t38;
    	let a0;
    	let t40;
    	let a1;
    	let t42;
    	let a2;
    	let t44;
    	let t45;
    	let p7;
    	let t47;
    	let div16;
    	let div14;
    	let h24;
    	let t49;
    	let div15;
    	let ul0;
    	let li0;
    	let t51;
    	let li1;
    	let t53;
    	let li2;
    	let t55;
    	let li3;
    	let t57;
    	let li4;
    	let t59;
    	let p8;
    	let t61;
    	let div19;
    	let div17;
    	let h25;
    	let t63;
    	let div18;
    	let ul1;
    	let li5;
    	let t65;
    	let li6;
    	let t67;
    	let li7;
    	let t69;
    	let li8;
    	let t71;
    	let div20;
    	let t72;
    	let div24;
    	let div21;
    	let h26;
    	let t74;
    	let div23;
    	let div22;
    	let table;
    	let thead;
    	let tr0;
    	let th0;
    	let t76;
    	let th1;
    	let t78;
    	let th2;
    	let t80;
    	let th3;
    	let t82;
    	let th4;
    	let t84;
    	let tbody;
    	let tr1;
    	let td0;
    	let t86;
    	let td1;
    	let td2;
    	let td3;
    	let td4;
    	let t91;
    	let tr2;
    	let td5;
    	let td6;
    	let td7;
    	let td8;
    	let t96;
    	let tr3;
    	let td9;
    	let td10;
    	let td11;
    	let td12;
    	let t101;
    	let tr4;
    	let td13;
    	let td14;
    	let td15;
    	let td16;
    	let t106;
    	let tr5;
    	let td17;
    	let t108;
    	let td18;
    	let td19;
    	let td20;
    	let td21;
    	let t113;
    	let tr6;
    	let td22;
    	let td23;
    	let td24;
    	let td25;
    	let t118;
    	let tr7;
    	let td26;
    	let td27;
    	let td28;
    	let td29;
    	let t123;
    	let tfoot;
    	let tr8;
    	let td30;
    	let td31;
    	let td32;
    	let t127;
    	let img1;
    	let img1_src_value;
    	let t128;
    	let div97;
    	let div25;
    	let h27;
    	let t130;
    	let div96;
    	let h30;
    	let t132;
    	let p9;
    	let t133;
    	let br0;
    	let t134;
    	let t135;
    	let div28;
    	let span1;
    	let t137;
    	let a3;
    	let div26;
    	let t139;
    	let a4;
    	let div27;
    	let t141;
    	let div31;
    	let span2;
    	let t143;
    	let a5;
    	let div29;
    	let t145;
    	let a6;
    	let div30;
    	let t147;
    	let div34;
    	let span3;
    	let t149;
    	let a7;
    	let div32;
    	let t151;
    	let a8;
    	let div33;
    	let t153;
    	let div36;
    	let span4;
    	let t155;
    	let a9;
    	let div35;
    	let t157;
    	let p10;
    	let t159;
    	let div37;
    	let t160;
    	let h31;
    	let t162;
    	let p11;
    	let t163;
    	let br1;
    	let t164;
    	let t165;
    	let div40;
    	let span5;
    	let t167;
    	let a10;
    	let div38;
    	let t169;
    	let a11;
    	let div39;
    	let t171;
    	let div43;
    	let span6;
    	let t173;
    	let a12;
    	let div41;
    	let t175;
    	let a13;
    	let div42;
    	let t177;
    	let div46;
    	let span7;
    	let t179;
    	let a14;
    	let div44;
    	let t181;
    	let a15;
    	let div45;
    	let t183;
    	let div48;
    	let span8;
    	let t185;
    	let a16;
    	let div47;
    	let t187;
    	let p12;
    	let t189;
    	let div49;
    	let t190;
    	let h32;
    	let t192;
    	let p13;
    	let t193;
    	let br2;
    	let t194;
    	let t195;
    	let div52;
    	let span9;
    	let t197;
    	let a17;
    	let div50;
    	let t199;
    	let a18;
    	let div51;
    	let t201;
    	let div55;
    	let span10;
    	let t203;
    	let a19;
    	let div53;
    	let t205;
    	let a20;
    	let div54;
    	let t207;
    	let p14;
    	let t209;
    	let div56;
    	let t210;
    	let h33;
    	let t212;
    	let p15;
    	let t213;
    	let br3;
    	let t214;
    	let t215;
    	let div59;
    	let span11;
    	let t217;
    	let a21;
    	let div57;
    	let t219;
    	let a22;
    	let div58;
    	let t221;
    	let div62;
    	let span12;
    	let t223;
    	let a23;
    	let div60;
    	let t225;
    	let a24;
    	let div61;
    	let t227;
    	let p16;
    	let t229;
    	let div63;
    	let t230;
    	let h34;
    	let t232;
    	let p17;
    	let t233;
    	let br4;
    	let t234;
    	let t235;
    	let div66;
    	let span13;
    	let t237;
    	let a25;
    	let div64;
    	let t239;
    	let a26;
    	let div65;
    	let t241;
    	let div69;
    	let span14;
    	let t243;
    	let a27;
    	let div67;
    	let t245;
    	let a28;
    	let div68;
    	let t247;
    	let div70;
    	let t248;
    	let h35;
    	let t250;
    	let p18;
    	let t251;
    	let br5;
    	let t252;
    	let t253;
    	let div73;
    	let span15;
    	let t255;
    	let a29;
    	let div71;
    	let t257;
    	let a30;
    	let div72;
    	let t259;
    	let div76;
    	let span16;
    	let t261;
    	let a31;
    	let div74;
    	let t263;
    	let a32;
    	let div75;
    	let t265;
    	let div77;
    	let t266;
    	let h36;
    	let t268;
    	let p19;
    	let t269;
    	let br6;
    	let t270;
    	let t271;
    	let div80;
    	let span17;
    	let t273;
    	let a33;
    	let div78;
    	let t275;
    	let a34;
    	let div79;
    	let t277;
    	let div83;
    	let span18;
    	let t279;
    	let a35;
    	let div81;
    	let t281;
    	let a36;
    	let div82;
    	let t283;
    	let div84;
    	let t284;
    	let h37;
    	let t286;
    	let p20;
    	let t287;
    	let br7;
    	let t288;
    	let t289;
    	let div87;
    	let span19;
    	let t291;
    	let a37;
    	let div85;
    	let t293;
    	let a38;
    	let div86;
    	let t295;
    	let div88;
    	let t296;
    	let h38;
    	let t298;
    	let p21;
    	let t299;
    	let br8;
    	let t300;
    	let t301;
    	let div91;
    	let span20;
    	let t303;
    	let a39;
    	let div89;
    	let t305;
    	let a40;
    	let div90;
    	let t307;
    	let div92;
    	let t308;
    	let h39;
    	let t310;
    	let p22;
    	let t311;
    	let div95;
    	let span21;
    	let t313;
    	let a41;
    	let div93;
    	let t315;
    	let a42;
    	let div94;
    	let t317;
    	let div100;
    	let div98;
    	let h28;
    	let t319;
    	let div99;
    	let ul2;
    	let historytab;
    	let updating_curYear;
    	let t320;
    	let div101;
    	let t321;
    	let div102;
    	let t322;
    	let div103;
    	let b1;
    	let t324;
    	let b2;
    	let t326;
    	let br9;
    	let t327;
    	let i4;
    	let t329;
    	let i5;
    	let t331;
    	let i6;
    	let t333;
    	let i7;
    	let t335;
    	let br10;
    	let t336;
    	let current;

    	function historytab_curYear_binding(value) {
    		/*historytab_curYear_binding*/ ctx[3](value);
    	}

    	let historytab_props = { yearsList: /*yearsList*/ ctx[2] };

    	if (/*curYear*/ ctx[0] !== void 0) {
    		historytab_props.curYear = /*curYear*/ ctx[0];
    	}

    	historytab = new HistoryTab({ props: historytab_props, $$inline: true });
    	binding_callbacks.push(() => bind(historytab, "curYear", historytab_curYear_binding));
    	let if_block = /*spcData*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div104 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Sogang Programming Contest";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "논리력과 문제 해결 능력을 겨루는 대회입니다.";
    			t3 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "소개";
    			t5 = space();
    			div2 = element("div");
    			div2.textContent = "SPC는 서강대학교 학부생을 위한 프로그래밍 대회입니다. 프로그래밍과 ICPC에 대한 관심을 높이고 학생들의\r\n\t\t\t논리력과 알고리즘 설계 능력을 향상하기 위한 대회로서 2005년부터 개최되었습니다. 참가자들은 주어진 문제들을\r\n\t\t\t시간 내에 프로그래밍 언어를 이용하여 해결해야 합니다.";
    			t7 = space();
    			img0 = element("img");
    			t8 = space();
    			div6 = element("div");
    			div4 = element("div");
    			h21 = element("h2");
    			h21.textContent = "개요";
    			t10 = space();
    			div5 = element("div");
    			p0 = element("p");
    			p0.textContent = "논리적인 사고력과 알고리즘 작성 능력을 평가하는 ICPC 유형의 문제가 출제됩니다.";
    			t12 = space();
    			p1 = element("p");
    			p1.textContent = "대회는 난이도에 따라 Master와 Champion로 나누어져 3시간 동안 진행되며, 대회 참가자들은 해당 Division에서\r\n\t\t\t\t총 6-9문제를 풀게 됩니다. Champion에는 모든 학생, Master에는 4학기 이하 학생만이 참가할 수 있습니다.\r\n\t\t\t\t시상은 Master와 Champion으로 나뉘어 진행됩니다.";
    			t14 = space();
    			div7 = element("div");
    			t15 = space();
    			div10 = element("div");
    			div8 = element("div");
    			h22 = element("h2");
    			h22.textContent = "참가";
    			t17 = space();
    			div9 = element("div");
    			p2 = element("p");
    			p2.textContent = "대학원생과 휴학생을 제외한 모든 서강대학교 학부생이 참가할 수 있습니다. 단, Champion 대상, 금상 수상자는\r\n\t\t\t\t다음 해부터 참가할 수 없고, Master 금상 수상자는 다음 해부터 Master에 참가할 수 없습니다.";
    			t19 = space();
    			div13 = element("div");
    			div11 = element("div");
    			h23 = element("h2");
    			h23.textContent = "규칙";
    			t21 = space();
    			div12 = element("div");
    			p3 = element("p");
    			t22 = text("대회 중 제출한 소스코드는 채점 서버에 의해 자동으로 채점되며, 실시간으로 결과를 알 수 있습니다. 문제를\r\n\t\t\t\t제출하였을 때 '");
    			b0 = element("b");
    			b0.textContent = "맞았습니다!!";
    			t24 = text("'를 받으면 문제를 푼 것으로, 이외의 결과를 받으면 틀린 것으로\r\n\t\t\t\t생각합니다.");
    			t25 = space();
    			p4 = element("p");
    			t26 = text("문제를 풀 때마다 패널티 점수가 누적됩니다. 패널티 점수는 모든 맞은 문제에 대해, 대회 시작 시간부터 그\r\n\t\t\t\t문제를 풀기까지 걸린 시간을 ");
    			i0 = element("i");
    			i0.textContent = "t";
    			t28 = text("분, 처음으로 문제를 맞기 직전까지 제출한 횟수를\r\n\t\t\t\t");
    			i1 = element("i");
    			i1.textContent = "w";
    			t30 = text("번이라고 할 때 (");
    			i2 = element("i");
    			i2.textContent = "t";
    			t32 = text(" + 20");
    			i3 = element("i");
    			i3.textContent = "w";
    			t34 = text(")점입니다.");
    			t35 = space();
    			p5 = element("p");
    			p5.textContent = "순위는 푼 문제가 많은 순서대로, 푼 문제가 같을 경우에는 패널티 점수의 합이 적은 순서대로 결정됩니다.";
    			t37 = space();
    			p6 = element("p");
    			t38 = text("대회는 ");
    			a0 = element("a");
    			a0.textContent = "Baekjoon Online Judge";
    			t40 = text("\r\n\t\t\t\t플랫폼에서 진행되며, 채점 관련 규칙은 BOJ의\r\n\t\t\t\t");
    			a1 = element("a");
    			a1.textContent = "채점 도움말";
    			t42 = text(",\r\n\t\t\t\t");
    			a2 = element("a");
    			a2.textContent = "언어 도움말";
    			t44 = text("을 참조합니다.");
    			t45 = space();
    			p7 = element("p");
    			p7.textContent = "모든 문제는 출제진이 C++과 Java(혹은 Kotlin)으로 정답을 작성했음이 보장됩니다.";
    			t47 = space();
    			div16 = element("div");
    			div14 = element("div");
    			h24 = element("h2");
    			h24.textContent = "사용 가능 언어";
    			t49 = space();
    			div15 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "C";
    			t51 = space();
    			li1 = element("li");
    			li1.textContent = "C++";
    			t53 = space();
    			li2 = element("li");
    			li2.textContent = "Java";
    			t55 = space();
    			li3 = element("li");
    			li3.textContent = "Python 3";
    			t57 = space();
    			li4 = element("li");
    			li4.textContent = "Kotlin";
    			t59 = space();
    			p8 = element("p");
    			p8.textContent = "사용 가능한 언어 목록은 변경될 수 있습니다.";
    			t61 = space();
    			div19 = element("div");
    			div17 = element("div");
    			h25 = element("h2");
    			h25.textContent = "주의사항";
    			t63 = space();
    			div18 = element("div");
    			ul1 = element("ul");
    			li5 = element("li");
    			li5.textContent = "대회 중 각 언어의 레퍼런스 페이지를 제외한 인터넷 사용은 금지됩니다.";
    			t65 = space();
    			li6 = element("li");
    			li6.textContent = "대회 종료 전에 퇴실할 수 없습니다.";
    			t67 = space();
    			li7 = element("li");
    			li7.textContent = "책이나 개인이 준비한 인쇄된 참고자료는 지참할 수 있습니다.";
    			t69 = space();
    			li8 = element("li");
    			li8.textContent = "휴대폰 및 전자기기는 사용할 수 없습니다.";
    			t71 = space();
    			div20 = element("div");
    			t72 = space();
    			div24 = element("div");
    			div21 = element("div");
    			h26 = element("h2");
    			h26.textContent = "시상 내역";
    			t74 = space();
    			div23 = element("div");
    			div22 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Division";
    			t76 = space();
    			th1 = element("th");
    			th1.textContent = "상";
    			t78 = space();
    			th2 = element("th");
    			th2.textContent = "인원";
    			t80 = space();
    			th3 = element("th");
    			th3.textContent = "상금";
    			t82 = space();
    			th4 = element("th");
    			th4.textContent = "총액";
    			t84 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Champion";
    			t86 = space();
    			td1 = element("td");
    			td1.textContent = "대상";
    			td2 = element("td");
    			td2.textContent = "1명";
    			td3 = element("td");
    			td3.textContent = "₩700,000";
    			td4 = element("td");
    			td4.textContent = "₩700,000";
    			t91 = space();
    			tr2 = element("tr");
    			td5 = element("td");
    			td5.textContent = "금상";
    			td6 = element("td");
    			td6.textContent = "1명";
    			td7 = element("td");
    			td7.textContent = "₩500,000";
    			td8 = element("td");
    			td8.textContent = "₩500,000";
    			t96 = space();
    			tr3 = element("tr");
    			td9 = element("td");
    			td9.textContent = "은상";
    			td10 = element("td");
    			td10.textContent = "2명";
    			td11 = element("td");
    			td11.textContent = "₩300,000";
    			td12 = element("td");
    			td12.textContent = "₩600,000";
    			t101 = space();
    			tr4 = element("tr");
    			td13 = element("td");
    			td13.textContent = "동상";
    			td14 = element("td");
    			td14.textContent = "3명";
    			td15 = element("td");
    			td15.textContent = "₩200,000";
    			td16 = element("td");
    			td16.textContent = "₩600,000";
    			t106 = space();
    			tr5 = element("tr");
    			td17 = element("td");
    			td17.textContent = "Master";
    			t108 = space();
    			td18 = element("td");
    			td18.textContent = "금상";
    			td19 = element("td");
    			td19.textContent = "1명";
    			td20 = element("td");
    			td20.textContent = "₩500,000";
    			td21 = element("td");
    			td21.textContent = "₩500,000";
    			t113 = space();
    			tr6 = element("tr");
    			td22 = element("td");
    			td22.textContent = "은상";
    			td23 = element("td");
    			td23.textContent = "2명";
    			td24 = element("td");
    			td24.textContent = "₩300,000";
    			td25 = element("td");
    			td25.textContent = "₩600,000";
    			t118 = space();
    			tr7 = element("tr");
    			td26 = element("td");
    			td26.textContent = "동상";
    			td27 = element("td");
    			td27.textContent = "3명";
    			td28 = element("td");
    			td28.textContent = "₩200,000";
    			td29 = element("td");
    			td29.textContent = "₩600,000";
    			t123 = space();
    			tfoot = element("tfoot");
    			tr8 = element("tr");
    			td30 = element("td");
    			td30.textContent = "합계";
    			td31 = element("td");
    			td31.textContent = "13명";
    			td32 = element("td");
    			td32.textContent = "₩4,100,000";
    			t127 = space();
    			img1 = element("img");
    			t128 = space();
    			div97 = element("div");
    			div25 = element("div");
    			h27 = element("h2");
    			h27.textContent = "역대 대회 문제";
    			t130 = space();
    			div96 = element("div");
    			h30 = element("h3");
    			h30.textContent = "2020년 - 제 16회";
    			t132 = space();
    			p9 = element("p");
    			t133 = text("2020년 11월 28일 토요일 오후 2시 ~ 5시");
    			br0 = element("br");
    			t134 = text("\r\n\t\t\t\tOnline");
    			t135 = space();
    			div28 = element("div");
    			span1 = element("span");
    			span1.textContent = "스코어보드";
    			t137 = space();
    			a3 = element("a");
    			div26 = element("div");
    			div26.textContent = "Master";
    			t139 = space();
    			a4 = element("a");
    			div27 = element("div");
    			div27.textContent = "Champion";
    			t141 = space();
    			div31 = element("div");
    			span2 = element("span");
    			span2.textContent = "문제 (PDF)";
    			t143 = space();
    			a5 = element("a");
    			div29 = element("div");
    			div29.textContent = "Master";
    			t145 = space();
    			a6 = element("a");
    			div30 = element("div");
    			div30.textContent = "Champion";
    			t147 = space();
    			div34 = element("div");
    			span3 = element("span");
    			span3.textContent = "문제 (BOJ)";
    			t149 = space();
    			a7 = element("a");
    			div32 = element("div");
    			div32.textContent = "Master";
    			t151 = space();
    			a8 = element("a");
    			div33 = element("div");
    			div33.textContent = "Champion";
    			t153 = space();
    			div36 = element("div");
    			span4 = element("span");
    			span4.textContent = "해설 (PDF)";
    			t155 = space();
    			a9 = element("a");
    			div35 = element("div");
    			div35.textContent = "Official Solutions";
    			t157 = space();
    			p10 = element("p");
    			p10.textContent = "출제 - 이기현, 이윤제, 임지환, 김주현, 안향빈, 이상원";
    			t159 = space();
    			div37 = element("div");
    			t160 = space();
    			h31 = element("h3");
    			h31.textContent = "2019년 - 제 15회";
    			t162 = space();
    			p11 = element("p");
    			t163 = text("2019년 11월 22일 금요일 오후 7시 ~ 10시");
    			br1 = element("br");
    			t164 = text("\r\n\t\t\t\t다산관 D104/D105");
    			t165 = space();
    			div40 = element("div");
    			span5 = element("span");
    			span5.textContent = "스코어보드";
    			t167 = space();
    			a10 = element("a");
    			div38 = element("div");
    			div38.textContent = "Master";
    			t169 = space();
    			a11 = element("a");
    			div39 = element("div");
    			div39.textContent = "Champion";
    			t171 = space();
    			div43 = element("div");
    			span6 = element("span");
    			span6.textContent = "문제 (PDF)";
    			t173 = space();
    			a12 = element("a");
    			div41 = element("div");
    			div41.textContent = "Master";
    			t175 = space();
    			a13 = element("a");
    			div42 = element("div");
    			div42.textContent = "Champion";
    			t177 = space();
    			div46 = element("div");
    			span7 = element("span");
    			span7.textContent = "문제 (BOJ)";
    			t179 = space();
    			a14 = element("a");
    			div44 = element("div");
    			div44.textContent = "Master";
    			t181 = space();
    			a15 = element("a");
    			div45 = element("div");
    			div45.textContent = "Champion";
    			t183 = space();
    			div48 = element("div");
    			span8 = element("span");
    			span8.textContent = "해설 (PDF)";
    			t185 = space();
    			a16 = element("a");
    			div47 = element("div");
    			div47.textContent = "Official Solutions";
    			t187 = space();
    			p12 = element("p");
    			p12.textContent = "출제 - 박건, 박수현, 이준석, 손정연, 윤기영, 정진욱";
    			t189 = space();
    			div49 = element("div");
    			t190 = space();
    			h32 = element("h3");
    			h32.textContent = "2018년 - 제 14회";
    			t192 = space();
    			p13 = element("p");
    			t193 = text("2018년 11월 23일 금요일 오후 7시 ~ 10시");
    			br2 = element("br");
    			t194 = text("\r\n\t\t\t\t다산관 D104");
    			t195 = space();
    			div52 = element("div");
    			span9 = element("span");
    			span9.textContent = "스코어보드";
    			t197 = space();
    			a17 = element("a");
    			div50 = element("div");
    			div50.textContent = "Master";
    			t199 = space();
    			a18 = element("a");
    			div51 = element("div");
    			div51.textContent = "Champion";
    			t201 = space();
    			div55 = element("div");
    			span10 = element("span");
    			span10.textContent = "문제";
    			t203 = space();
    			a19 = element("a");
    			div53 = element("div");
    			div53.textContent = "Master";
    			t205 = space();
    			a20 = element("a");
    			div54 = element("div");
    			div54.textContent = "Champion";
    			t207 = space();
    			p14 = element("p");
    			p14.textContent = "출제 - 이준석, 최윤영, 최지원, 손정연, 윤기영, 정진욱";
    			t209 = space();
    			div56 = element("div");
    			t210 = space();
    			h33 = element("h3");
    			h33.textContent = "2017년 - 제 13회";
    			t212 = space();
    			p15 = element("p");
    			t213 = text("2017년 11월 20일 월요일 오후 7시 ~ 10시");
    			br3 = element("br");
    			t214 = text("\r\n\t\t\t\t다산관 D104");
    			t215 = space();
    			div59 = element("div");
    			span11 = element("span");
    			span11.textContent = "스코어보드";
    			t217 = space();
    			a21 = element("a");
    			div57 = element("div");
    			div57.textContent = "Master";
    			t219 = space();
    			a22 = element("a");
    			div58 = element("div");
    			div58.textContent = "Champion";
    			t221 = space();
    			div62 = element("div");
    			span12 = element("span");
    			span12.textContent = "문제";
    			t223 = space();
    			a23 = element("a");
    			div60 = element("div");
    			div60.textContent = "Master";
    			t225 = space();
    			a24 = element("a");
    			div61 = element("div");
    			div61.textContent = "Champion";
    			t227 = space();
    			p16 = element("p");
    			p16.textContent = "출제 - 박건, 이준석, 최윤영, 고성빈, 정성엽, 하태훈";
    			t229 = space();
    			div63 = element("div");
    			t230 = space();
    			h34 = element("h3");
    			h34.textContent = "2016년 - 제 12회";
    			t232 = space();
    			p17 = element("p");
    			t233 = text("2016년 11월 21일 월요일 오후 7시 ~ 10시");
    			br4 = element("br");
    			t234 = text("\r\n\t\t\t\t리치과학관 R912 / R914");
    			t235 = space();
    			div66 = element("div");
    			span13 = element("span");
    			span13.textContent = "스코어보드";
    			t237 = space();
    			a25 = element("a");
    			div64 = element("div");
    			div64.textContent = "Master";
    			t239 = space();
    			a26 = element("a");
    			div65 = element("div");
    			div65.textContent = "Champion";
    			t241 = space();
    			div69 = element("div");
    			span14 = element("span");
    			span14.textContent = "문제";
    			t243 = space();
    			a27 = element("a");
    			div67 = element("div");
    			div67.textContent = "Master";
    			t245 = space();
    			a28 = element("a");
    			div68 = element("div");
    			div68.textContent = "Champion";
    			t247 = space();
    			div70 = element("div");
    			t248 = space();
    			h35 = element("h3");
    			h35.textContent = "2015년 - 제 11회";
    			t250 = space();
    			p18 = element("p");
    			t251 = text("2015년 11월 23일 월요일 오후 7시 ~ 10시");
    			br5 = element("br");
    			t252 = text("\r\n\t\t\t\t리치과학관 R912 / R914");
    			t253 = space();
    			div73 = element("div");
    			span15 = element("span");
    			span15.textContent = "스코어보드";
    			t255 = space();
    			a29 = element("a");
    			div71 = element("div");
    			div71.textContent = "Master";
    			t257 = space();
    			a30 = element("a");
    			div72 = element("div");
    			div72.textContent = "Champion";
    			t259 = space();
    			div76 = element("div");
    			span16 = element("span");
    			span16.textContent = "문제";
    			t261 = space();
    			a31 = element("a");
    			div74 = element("div");
    			div74.textContent = "Master";
    			t263 = space();
    			a32 = element("a");
    			div75 = element("div");
    			div75.textContent = "Champion";
    			t265 = space();
    			div77 = element("div");
    			t266 = space();
    			h36 = element("h3");
    			h36.textContent = "2014년 - 제 10회";
    			t268 = space();
    			p19 = element("p");
    			t269 = text("2014년 11월 20일 월요일 오후 7시 ~ 10시");
    			br6 = element("br");
    			t270 = text("\r\n\t\t\t\t리치과학관 R912 / R914");
    			t271 = space();
    			div80 = element("div");
    			span17 = element("span");
    			span17.textContent = "스코어보드";
    			t273 = space();
    			a33 = element("a");
    			div78 = element("div");
    			div78.textContent = "Master";
    			t275 = space();
    			a34 = element("a");
    			div79 = element("div");
    			div79.textContent = "Champion";
    			t277 = space();
    			div83 = element("div");
    			span18 = element("span");
    			span18.textContent = "문제";
    			t279 = space();
    			a35 = element("a");
    			div81 = element("div");
    			div81.textContent = "Master";
    			t281 = space();
    			a36 = element("a");
    			div82 = element("div");
    			div82.textContent = "Champion";
    			t283 = space();
    			div84 = element("div");
    			t284 = space();
    			h37 = element("h3");
    			h37.textContent = "2013년 - 제 9회";
    			t286 = space();
    			p20 = element("p");
    			t287 = text("2013년 11월 28일 목요일 오후 6시 30분 ~ 9시 30분");
    			br7 = element("br");
    			t288 = text("\r\n\t\t\t\t김대건관 K512 / 리치과학관 R914");
    			t289 = space();
    			div87 = element("div");
    			span19 = element("span");
    			span19.textContent = "문제";
    			t291 = space();
    			a37 = element("a");
    			div85 = element("div");
    			div85.textContent = "Challenger";
    			t293 = space();
    			a38 = element("a");
    			div86 = element("div");
    			div86.textContent = "Champion";
    			t295 = space();
    			div88 = element("div");
    			t296 = space();
    			h38 = element("h3");
    			h38.textContent = "2012년 - 제 8회";
    			t298 = space();
    			p21 = element("p");
    			t299 = text("2012년 11월 29일 목요일 오후 6시 30분 ~ 9시 30분");
    			br8 = element("br");
    			t300 = text("\r\n\t\t\t\t리치과학관 R912 / R914");
    			t301 = space();
    			div91 = element("div");
    			span20 = element("span");
    			span20.textContent = "문제";
    			t303 = space();
    			a39 = element("a");
    			div89 = element("div");
    			div89.textContent = "Challenger";
    			t305 = space();
    			a40 = element("a");
    			div90 = element("div");
    			div90.textContent = "Champion";
    			t307 = space();
    			div92 = element("div");
    			t308 = space();
    			h39 = element("h3");
    			h39.textContent = "2011년 - 제 7회";
    			t310 = space();
    			p22 = element("p");
    			t311 = space();
    			div95 = element("div");
    			span21 = element("span");
    			span21.textContent = "문제";
    			t313 = space();
    			a41 = element("a");
    			div93 = element("div");
    			div93.textContent = "Challenger";
    			t315 = space();
    			a42 = element("a");
    			div94 = element("div");
    			div94.textContent = "Champion";
    			t317 = space();
    			div100 = element("div");
    			div98 = element("div");
    			h28 = element("h2");
    			h28.textContent = "역대 대회 기록";
    			t319 = space();
    			div99 = element("div");
    			ul2 = element("ul");
    			create_component(historytab.$$.fragment);
    			t320 = space();
    			div101 = element("div");
    			if (if_block) if_block.c();
    			t321 = space();
    			div102 = element("div");
    			t322 = space();
    			div103 = element("div");
    			b1 = element("b");
    			b1.textContent = "#";
    			t324 = text(" = 순위, ");
    			b2 = element("b");
    			b2.textContent = "=";
    			t326 = text(" = 푼 문제 수 / 점수");
    			br9 = element("br");
    			t327 = space();
    			i4 = element("i");
    			i4.textContent = "★";
    			t329 = text(" = 대상,\r\n\t\t");
    			i5 = element("i");
    			i5.textContent = "⬤";
    			t331 = text(" = 금상,\r\n\t\t");
    			i6 = element("i");
    			i6.textContent = "⬤";
    			t333 = text(" = 은상,\r\n\t\t");
    			i7 = element("i");
    			i7.textContent = "⬤";
    			t335 = text(" = 동상");
    			br10 = element("br");
    			t336 = text("\r\n\t\t2014년 이전의 정보는 완전하지 않을 수 있습니다. 정보 등록/수정 요청은 하단의 학회장 메일로 메일을 보내 주세요.");
    			attr_dev(span0, "class", "subtitle");
    			add_location(span0, file$3, 33, 2, 751);
    			add_location(h1, file$3, 34, 2, 811);
    			attr_dev(div0, "class", "pad");
    			add_location(div0, file$3, 32, 1, 730);
    			add_location(h20, file$3, 38, 3, 920);
    			attr_dev(div1, "class", "p25");
    			add_location(div1, file$3, 37, 2, 898);
    			attr_dev(div2, "class", "p75");
    			add_location(div2, file$3, 40, 2, 945);
    			attr_dev(div3, "class", "row pad first_paragraph");
    			add_location(div3, file$3, 36, 1, 857);
    			attr_dev(img0, "class", "pad");
    			if (img0.src !== (img0_src_value = "/res/spc2019.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "2019 Sogang Programming Contest");
    			add_location(img0, file$3, 46, 1, 1150);
    			add_location(h21, file$3, 50, 3, 1282);
    			attr_dev(div4, "class", "p25");
    			add_location(div4, file$3, 49, 2, 1260);
    			add_location(p0, file$3, 53, 3, 1329);
    			add_location(p1, file$3, 54, 3, 1387);
    			attr_dev(div5, "class", "p75");
    			add_location(div5, file$3, 52, 2, 1307);
    			attr_dev(div6, "class", "row pad");
    			add_location(div6, file$3, 48, 1, 1235);
    			attr_dev(div7, "class", "hr");
    			add_location(div7, file$3, 61, 1, 1609);
    			add_location(h22, file$3, 64, 3, 1677);
    			attr_dev(div8, "class", "p25");
    			add_location(div8, file$3, 63, 2, 1655);
    			add_location(p2, file$3, 67, 3, 1724);
    			attr_dev(div9, "class", "p75");
    			add_location(div9, file$3, 66, 2, 1702);
    			attr_dev(div10, "class", "row pad");
    			add_location(div10, file$3, 62, 1, 1630);
    			add_location(h23, file$3, 75, 3, 1939);
    			attr_dev(div11, "class", "p25");
    			add_location(div11, file$3, 74, 2, 1917);
    			add_location(b0, file$3, 80, 13, 2069);
    			add_location(p3, file$3, 78, 3, 1986);
    			add_location(i0, file$3, 85, 20, 2235);
    			add_location(i1, file$3, 86, 4, 2276);
    			add_location(i2, file$3, 86, 22, 2294);
    			add_location(i3, file$3, 86, 35, 2307);
    			add_location(p4, file$3, 83, 3, 2145);
    			add_location(p5, file$3, 88, 3, 2335);
    			attr_dev(a0, "href", "https://www.acmicpc.net/");
    			attr_dev(a0, "target", "blank");
    			add_location(a0, file$3, 90, 8, 2418);
    			attr_dev(a1, "href", "https://www.acmicpc.net/help/judge");
    			attr_dev(a1, "target", "blank");
    			add_location(a1, file$3, 92, 4, 2531);
    			attr_dev(a2, "href", "https://www.acmicpc.net/help/language");
    			attr_dev(a2, "target", "blank");
    			add_location(a2, file$3, 93, 4, 2608);
    			add_location(p6, file$3, 89, 3, 2405);
    			add_location(p7, file$3, 95, 3, 2703);
    			attr_dev(div12, "class", "p75");
    			add_location(div12, file$3, 77, 2, 1964);
    			attr_dev(div13, "class", "row pad");
    			add_location(div13, file$3, 73, 1, 1892);
    			add_location(h24, file$3, 100, 3, 2830);
    			attr_dev(div14, "class", "p25");
    			add_location(div14, file$3, 99, 2, 2808);
    			add_location(li0, file$3, 104, 4, 2908);
    			add_location(li1, file$3, 105, 4, 2924);
    			add_location(li2, file$3, 106, 4, 2942);
    			add_location(li3, file$3, 107, 4, 2961);
    			add_location(li4, file$3, 108, 4, 2984);
    			attr_dev(ul0, "class", "bullet");
    			add_location(ul0, file$3, 103, 3, 2883);
    			set_style(p8, "margin-top", "16px");
    			add_location(p8, file$3, 110, 3, 3014);
    			attr_dev(div15, "class", "p75");
    			add_location(div15, file$3, 102, 2, 2861);
    			attr_dev(div16, "class", "row pad");
    			add_location(div16, file$3, 98, 1, 2783);
    			add_location(h25, file$3, 115, 3, 3141);
    			attr_dev(div17, "class", "p25");
    			add_location(div17, file$3, 114, 2, 3119);
    			add_location(li5, file$3, 119, 4, 3215);
    			add_location(li6, file$3, 120, 4, 3269);
    			add_location(li7, file$3, 121, 4, 3304);
    			add_location(li8, file$3, 122, 4, 3352);
    			attr_dev(ul1, "class", "bullet");
    			add_location(ul1, file$3, 118, 3, 3190);
    			attr_dev(div18, "class", "p75");
    			add_location(div18, file$3, 117, 2, 3168);
    			attr_dev(div19, "class", "row pad");
    			add_location(div19, file$3, 113, 1, 3094);
    			attr_dev(div20, "class", "hr");
    			add_location(div20, file$3, 126, 1, 3416);
    			add_location(h26, file$3, 129, 3, 3484);
    			attr_dev(div21, "class", "p25");
    			add_location(div21, file$3, 128, 2, 3462);
    			add_location(th0, file$3, 136, 7, 3633);
    			add_location(th1, file$3, 136, 25, 3651);
    			add_location(th2, file$3, 136, 36, 3662);
    			add_location(th3, file$3, 137, 7, 3682);
    			add_location(th4, file$3, 137, 19, 3694);
    			add_location(tr0, file$3, 135, 6, 3620);
    			add_location(thead, file$3, 134, 5, 3605);
    			attr_dev(td0, "rowspan", "4");
    			set_style(td0, "vertical-align", "middle");
    			add_location(td0, file$3, 142, 7, 3768);
    			add_location(td1, file$3, 143, 7, 3837);
    			attr_dev(td2, "class", "l");
    			add_location(td2, file$3, 143, 18, 3848);
    			attr_dev(td3, "class", "l");
    			add_location(td3, file$3, 143, 39, 3869);
    			attr_dev(td4, "class", "l");
    			add_location(td4, file$3, 143, 66, 3896);
    			add_location(tr1, file$3, 141, 6, 3755);
    			add_location(td5, file$3, 146, 7, 3957);
    			attr_dev(td6, "class", "l");
    			add_location(td6, file$3, 146, 18, 3968);
    			attr_dev(td7, "class", "l");
    			add_location(td7, file$3, 146, 39, 3989);
    			attr_dev(td8, "class", "l");
    			add_location(td8, file$3, 146, 66, 4016);
    			add_location(tr2, file$3, 145, 6, 3944);
    			add_location(td9, file$3, 149, 7, 4077);
    			attr_dev(td10, "class", "l");
    			add_location(td10, file$3, 149, 18, 4088);
    			attr_dev(td11, "class", "l");
    			add_location(td11, file$3, 149, 39, 4109);
    			attr_dev(td12, "class", "l");
    			add_location(td12, file$3, 149, 66, 4136);
    			add_location(tr3, file$3, 148, 6, 4064);
    			add_location(td13, file$3, 152, 7, 4197);
    			attr_dev(td14, "class", "l");
    			add_location(td14, file$3, 152, 18, 4208);
    			attr_dev(td15, "class", "l");
    			add_location(td15, file$3, 152, 39, 4229);
    			attr_dev(td16, "class", "l");
    			add_location(td16, file$3, 152, 66, 4256);
    			add_location(tr4, file$3, 151, 6, 4184);
    			attr_dev(td17, "rowspan", "3");
    			set_style(td17, "vertical-align", "middle");
    			add_location(td17, file$3, 156, 7, 4319);
    			add_location(td18, file$3, 157, 7, 4386);
    			attr_dev(td19, "class", "l");
    			add_location(td19, file$3, 157, 18, 4397);
    			attr_dev(td20, "class", "l");
    			add_location(td20, file$3, 157, 39, 4418);
    			attr_dev(td21, "class", "l");
    			add_location(td21, file$3, 157, 66, 4445);
    			add_location(tr5, file$3, 155, 6, 4306);
    			add_location(td22, file$3, 160, 7, 4506);
    			attr_dev(td23, "class", "l");
    			add_location(td23, file$3, 160, 18, 4517);
    			attr_dev(td24, "class", "l");
    			add_location(td24, file$3, 160, 39, 4538);
    			attr_dev(td25, "class", "l");
    			add_location(td25, file$3, 160, 66, 4565);
    			add_location(tr6, file$3, 159, 6, 4493);
    			add_location(td26, file$3, 163, 7, 4626);
    			attr_dev(td27, "class", "l");
    			add_location(td27, file$3, 163, 18, 4637);
    			attr_dev(td28, "class", "l");
    			add_location(td28, file$3, 163, 39, 4658);
    			attr_dev(td29, "class", "l");
    			add_location(td29, file$3, 163, 66, 4685);
    			add_location(tr7, file$3, 162, 6, 4613);
    			add_location(tbody, file$3, 140, 5, 3740);
    			attr_dev(td30, "colspan", "2");
    			add_location(td30, file$3, 168, 7, 4775);
    			attr_dev(td31, "class", "l");
    			add_location(td31, file$3, 168, 30, 4798);
    			attr_dev(td32, "colspan", "2");
    			attr_dev(td32, "class", "l");
    			add_location(td32, file$3, 168, 52, 4820);
    			add_location(tr8, file$3, 167, 6, 4762);
    			add_location(tfoot, file$3, 166, 5, 4747);
    			set_style(table, "width", "700px");
    			add_location(table, file$3, 133, 4, 3569);
    			attr_dev(div22, "class", "table_container");
    			add_location(div22, file$3, 132, 3, 3534);
    			attr_dev(div23, "class", "p75");
    			add_location(div23, file$3, 131, 2, 3512);
    			attr_dev(div24, "class", "row pad");
    			add_location(div24, file$3, 127, 1, 3437);
    			attr_dev(img1, "class", "pad");
    			if (img1.src !== (img1_src_value = "/res/spc2018.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Sogang Programming Contest posters");
    			add_location(img1, file$3, 175, 1, 4936);
    			add_location(h27, file$3, 178, 3, 5069);
    			attr_dev(div25, "class", "p25");
    			add_location(div25, file$3, 177, 2, 5047);
    			add_location(h30, file$3, 181, 3, 5122);
    			add_location(br0, file$3, 183, 32, 5186);
    			add_location(p9, file$3, 182, 3, 5149);
    			attr_dev(span1, "class", "contest_section");
    			add_location(span1, file$3, 187, 4, 5254);
    			attr_dev(div26, "class", "button");
    			add_location(div26, file$3, 189, 6, 5382);
    			attr_dev(a3, "href", "https://www.acmicpc.net/contest/scoreboard/562");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$3, 188, 4, 5302);
    			attr_dev(div27, "class", "button");
    			add_location(div27, file$3, 192, 6, 5510);
    			attr_dev(a4, "href", "https://www.acmicpc.net/contest/scoreboard/563");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$3, 191, 4, 5430);
    			attr_dev(div28, "class", "button_container");
    			add_location(div28, file$3, 186, 3, 5218);
    			attr_dev(span2, "class", "contest_section");
    			add_location(span2, file$3, 196, 4, 5606);
    			attr_dev(div29, "class", "button");
    			add_location(div29, file$3, 197, 43, 5696);
    			attr_dev(a5, "href", "/spc/contest/2020/master.pdf");
    			add_location(a5, file$3, 197, 4, 5657);
    			attr_dev(div30, "class", "button");
    			add_location(div30, file$3, 198, 45, 5779);
    			attr_dev(a6, "href", "/spc/contest/2020/champion.pdf");
    			add_location(a6, file$3, 198, 4, 5738);
    			attr_dev(div31, "class", "button_container");
    			add_location(div31, file$3, 195, 3, 5570);
    			attr_dev(span3, "class", "contest_section");
    			add_location(span3, file$3, 201, 4, 5869);
    			attr_dev(div32, "class", "button");
    			add_location(div32, file$3, 203, 6, 5998);
    			attr_dev(a7, "href", "https://www.acmicpc.net/category/detail/2355");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file$3, 202, 4, 5920);
    			attr_dev(div33, "class", "button");
    			add_location(div33, file$3, 206, 6, 6124);
    			attr_dev(a8, "href", "https://www.acmicpc.net/category/detail/2354");
    			attr_dev(a8, "target", "_blank");
    			add_location(a8, file$3, 205, 4, 6046);
    			attr_dev(div34, "class", "button_container");
    			add_location(div34, file$3, 200, 3, 5833);
    			attr_dev(span4, "class", "contest_section");
    			add_location(span4, file$3, 210, 4, 6220);
    			attr_dev(div35, "class", "button");
    			add_location(div35, file$3, 211, 46, 6313);
    			attr_dev(a9, "href", "/spc/contest/2020/solutions.pdf");
    			add_location(a9, file$3, 211, 4, 6271);
    			attr_dev(div36, "class", "button_container");
    			add_location(div36, file$3, 209, 3, 6184);
    			add_location(p10, file$3, 213, 3, 6377);
    			attr_dev(div37, "class", "hl");
    			add_location(div37, file$3, 214, 3, 6422);
    			add_location(h31, file$3, 216, 3, 6447);
    			add_location(br1, file$3, 218, 33, 6512);
    			add_location(p11, file$3, 217, 3, 6474);
    			attr_dev(span5, "class", "contest_section");
    			add_location(span5, file$3, 222, 4, 6587);
    			attr_dev(div38, "class", "button");
    			add_location(div38, file$3, 224, 6, 6715);
    			attr_dev(a10, "href", "https://www.acmicpc.net/contest/scoreboard/487");
    			attr_dev(a10, "target", "_blank");
    			add_location(a10, file$3, 223, 4, 6635);
    			attr_dev(div39, "class", "button");
    			add_location(div39, file$3, 227, 6, 6843);
    			attr_dev(a11, "href", "https://www.acmicpc.net/contest/scoreboard/488");
    			attr_dev(a11, "target", "_blank");
    			add_location(a11, file$3, 226, 4, 6763);
    			attr_dev(div40, "class", "button_container");
    			add_location(div40, file$3, 221, 3, 6551);
    			attr_dev(span6, "class", "contest_section");
    			add_location(span6, file$3, 231, 4, 6939);
    			attr_dev(div41, "class", "button");
    			add_location(div41, file$3, 232, 43, 7029);
    			attr_dev(a12, "href", "/spc/contest/2019/master.pdf");
    			add_location(a12, file$3, 232, 4, 6990);
    			attr_dev(div42, "class", "button");
    			add_location(div42, file$3, 233, 45, 7112);
    			attr_dev(a13, "href", "/spc/contest/2019/champion.pdf");
    			add_location(a13, file$3, 233, 4, 7071);
    			attr_dev(div43, "class", "button_container");
    			add_location(div43, file$3, 230, 3, 6903);
    			attr_dev(span7, "class", "contest_section");
    			add_location(span7, file$3, 236, 4, 7202);
    			attr_dev(div44, "class", "button");
    			add_location(div44, file$3, 238, 6, 7331);
    			attr_dev(a14, "href", "https://www.acmicpc.net/category/detail/2129");
    			attr_dev(a14, "target", "_blank");
    			add_location(a14, file$3, 237, 4, 7253);
    			attr_dev(div45, "class", "button");
    			add_location(div45, file$3, 241, 6, 7457);
    			attr_dev(a15, "href", "https://www.acmicpc.net/category/detail/2128");
    			attr_dev(a15, "target", "_blank");
    			add_location(a15, file$3, 240, 4, 7379);
    			attr_dev(div46, "class", "button_container");
    			add_location(div46, file$3, 235, 3, 7166);
    			attr_dev(span8, "class", "contest_section");
    			add_location(span8, file$3, 245, 4, 7553);
    			attr_dev(div47, "class", "button");
    			add_location(div47, file$3, 246, 46, 7646);
    			attr_dev(a16, "href", "/spc/contest/2019/solutions.pdf");
    			add_location(a16, file$3, 246, 4, 7604);
    			attr_dev(div48, "class", "button_container");
    			add_location(div48, file$3, 244, 3, 7517);
    			add_location(p12, file$3, 248, 3, 7710);
    			attr_dev(div49, "class", "hl");
    			add_location(div49, file$3, 249, 3, 7754);
    			add_location(h32, file$3, 251, 3, 7779);
    			add_location(br2, file$3, 253, 33, 7844);
    			add_location(p13, file$3, 252, 3, 7806);
    			attr_dev(span9, "class", "contest_section");
    			add_location(span9, file$3, 257, 4, 7914);
    			attr_dev(div50, "class", "button");
    			add_location(div50, file$3, 258, 72, 8030);
    			attr_dev(a17, "href", "https://www.acmicpc.net/contest/board/368");
    			attr_dev(a17, "target", "_blank");
    			add_location(a17, file$3, 258, 4, 7962);
    			attr_dev(div51, "class", "button");
    			add_location(div51, file$3, 260, 6, 8147);
    			attr_dev(a18, "href", "https://www.acmicpc.net/contest/board/379");
    			attr_dev(a18, "target", "_blank");
    			add_location(a18, file$3, 259, 4, 8072);
    			attr_dev(div52, "class", "button_container");
    			add_location(div52, file$3, 256, 3, 7878);
    			attr_dev(span10, "class", "contest_section");
    			add_location(span10, file$3, 264, 4, 8243);
    			attr_dev(div53, "class", "button");
    			add_location(div53, file$3, 266, 6, 8366);
    			attr_dev(a19, "href", "https://www.acmicpc.net/category/detail/1961");
    			attr_dev(a19, "target", "_blank");
    			add_location(a19, file$3, 265, 4, 8288);
    			attr_dev(div54, "class", "button");
    			add_location(div54, file$3, 269, 6, 8492);
    			attr_dev(a20, "href", "https://www.acmicpc.net/category/detail/1962");
    			attr_dev(a20, "target", "_blank");
    			add_location(a20, file$3, 268, 4, 8414);
    			attr_dev(div55, "class", "button_container");
    			add_location(div55, file$3, 263, 3, 8207);
    			add_location(p14, file$3, 272, 3, 8552);
    			attr_dev(div56, "class", "hl");
    			add_location(div56, file$3, 273, 3, 8597);
    			add_location(h33, file$3, 275, 3, 8622);
    			add_location(br3, file$3, 277, 33, 8687);
    			add_location(p15, file$3, 276, 3, 8649);
    			attr_dev(span11, "class", "contest_section");
    			add_location(span11, file$3, 281, 4, 8757);
    			attr_dev(div57, "class", "button");
    			add_location(div57, file$3, 282, 72, 8873);
    			attr_dev(a21, "href", "https://www.acmicpc.net/contest/board/265");
    			attr_dev(a21, "target", "_blank");
    			add_location(a21, file$3, 282, 4, 8805);
    			attr_dev(div58, "class", "button");
    			add_location(div58, file$3, 284, 6, 8990);
    			attr_dev(a22, "href", "https://www.acmicpc.net/contest/board/266");
    			attr_dev(a22, "target", "_blank");
    			add_location(a22, file$3, 283, 4, 8915);
    			attr_dev(div59, "class", "button_container");
    			add_location(div59, file$3, 280, 3, 8721);
    			attr_dev(span12, "class", "contest_section");
    			add_location(span12, file$3, 288, 4, 9086);
    			attr_dev(div60, "class", "button");
    			add_location(div60, file$3, 290, 6, 9209);
    			attr_dev(a23, "href", "https://www.acmicpc.net/category/detail/1809");
    			attr_dev(a23, "target", "_blank");
    			add_location(a23, file$3, 289, 4, 9131);
    			attr_dev(div61, "class", "button");
    			add_location(div61, file$3, 293, 6, 9335);
    			attr_dev(a24, "href", "https://www.acmicpc.net/category/detail/1810");
    			attr_dev(a24, "target", "_blank");
    			add_location(a24, file$3, 292, 4, 9257);
    			attr_dev(div62, "class", "button_container");
    			add_location(div62, file$3, 287, 3, 9050);
    			add_location(p16, file$3, 296, 3, 9395);
    			attr_dev(div63, "class", "hl");
    			add_location(div63, file$3, 297, 3, 9439);
    			add_location(h34, file$3, 299, 3, 9464);
    			add_location(br4, file$3, 301, 33, 9529);
    			add_location(p17, file$3, 300, 3, 9491);
    			attr_dev(span13, "class", "contest_section");
    			add_location(span13, file$3, 305, 4, 9608);
    			attr_dev(div64, "class", "button");
    			add_location(div64, file$3, 306, 72, 9724);
    			attr_dev(a25, "href", "https://www.acmicpc.net/contest/board/204");
    			attr_dev(a25, "target", "_blank");
    			add_location(a25, file$3, 306, 4, 9656);
    			attr_dev(div65, "class", "button");
    			add_location(div65, file$3, 308, 6, 9841);
    			attr_dev(a26, "href", "https://www.acmicpc.net/contest/board/203");
    			attr_dev(a26, "target", "_blank");
    			add_location(a26, file$3, 307, 4, 9766);
    			attr_dev(div66, "class", "button_container");
    			add_location(div66, file$3, 304, 3, 9572);
    			attr_dev(span14, "class", "contest_section");
    			add_location(span14, file$3, 312, 4, 9937);
    			attr_dev(div67, "class", "button");
    			add_location(div67, file$3, 314, 6, 10060);
    			attr_dev(a27, "href", "https://www.acmicpc.net/category/detail/1577");
    			attr_dev(a27, "target", "_blank");
    			add_location(a27, file$3, 313, 4, 9982);
    			attr_dev(div68, "class", "button");
    			add_location(div68, file$3, 317, 6, 10186);
    			attr_dev(a28, "href", "https://www.acmicpc.net/category/detail/1576");
    			attr_dev(a28, "target", "_blank");
    			add_location(a28, file$3, 316, 4, 10108);
    			attr_dev(div69, "class", "button_container");
    			add_location(div69, file$3, 311, 3, 9901);
    			attr_dev(div70, "class", "hl");
    			add_location(div70, file$3, 320, 3, 10246);
    			add_location(h35, file$3, 322, 3, 10271);
    			add_location(br5, file$3, 324, 33, 10336);
    			add_location(p18, file$3, 323, 3, 10298);
    			attr_dev(span15, "class", "contest_section");
    			add_location(span15, file$3, 328, 4, 10415);
    			attr_dev(div71, "class", "button");
    			add_location(div71, file$3, 329, 72, 10531);
    			attr_dev(a29, "href", "https://www.acmicpc.net/contest/board/141");
    			attr_dev(a29, "target", "_blank");
    			add_location(a29, file$3, 329, 4, 10463);
    			attr_dev(div72, "class", "button");
    			add_location(div72, file$3, 331, 6, 10648);
    			attr_dev(a30, "href", "https://www.acmicpc.net/contest/board/142");
    			attr_dev(a30, "target", "_blank");
    			add_location(a30, file$3, 330, 4, 10573);
    			attr_dev(div73, "class", "button_container");
    			add_location(div73, file$3, 327, 3, 10379);
    			attr_dev(span16, "class", "contest_section");
    			add_location(span16, file$3, 335, 4, 10744);
    			attr_dev(div74, "class", "button");
    			add_location(div74, file$3, 337, 6, 10867);
    			attr_dev(a31, "href", "https://www.acmicpc.net/category/detail/1420");
    			attr_dev(a31, "target", "_blank");
    			add_location(a31, file$3, 336, 4, 10789);
    			attr_dev(div75, "class", "button");
    			add_location(div75, file$3, 340, 6, 10993);
    			attr_dev(a32, "href", "https://www.acmicpc.net/category/detail/1421");
    			attr_dev(a32, "target", "_blank");
    			add_location(a32, file$3, 339, 4, 10915);
    			attr_dev(div76, "class", "button_container");
    			add_location(div76, file$3, 334, 3, 10708);
    			attr_dev(div77, "class", "hl");
    			add_location(div77, file$3, 343, 3, 11053);
    			add_location(h36, file$3, 345, 3, 11078);
    			add_location(br6, file$3, 347, 33, 11143);
    			add_location(p19, file$3, 346, 3, 11105);
    			attr_dev(span17, "class", "contest_section");
    			add_location(span17, file$3, 351, 4, 11222);
    			attr_dev(div78, "class", "button");
    			add_location(div78, file$3, 353, 6, 11349);
    			attr_dev(a33, "href", "https://www.acmicpc.net/contest/scoreboard/74");
    			attr_dev(a33, "target", "_blank");
    			add_location(a33, file$3, 352, 4, 11270);
    			attr_dev(div79, "class", "button");
    			add_location(div79, file$3, 356, 6, 11476);
    			attr_dev(a34, "href", "https://www.acmicpc.net/contest/scoreboard/75");
    			attr_dev(a34, "target", "_blank");
    			add_location(a34, file$3, 355, 4, 11397);
    			attr_dev(div80, "class", "button_container");
    			add_location(div80, file$3, 350, 3, 11186);
    			attr_dev(span18, "class", "contest_section");
    			add_location(span18, file$3, 360, 4, 11572);
    			attr_dev(div81, "class", "button");
    			add_location(div81, file$3, 362, 6, 11695);
    			attr_dev(a35, "href", "https://www.acmicpc.net/category/detail/1299");
    			attr_dev(a35, "target", "_blank");
    			add_location(a35, file$3, 361, 4, 11617);
    			attr_dev(div82, "class", "button");
    			add_location(div82, file$3, 365, 6, 11821);
    			attr_dev(a36, "href", "https://www.acmicpc.net/category/detail/1300");
    			attr_dev(a36, "target", "_blank");
    			add_location(a36, file$3, 364, 4, 11743);
    			attr_dev(div83, "class", "button_container");
    			add_location(div83, file$3, 359, 3, 11536);
    			attr_dev(div84, "class", "hl");
    			add_location(div84, file$3, 368, 3, 11881);
    			add_location(h37, file$3, 370, 3, 11906);
    			add_location(br7, file$3, 372, 40, 11977);
    			add_location(p20, file$3, 371, 3, 11932);
    			attr_dev(span19, "class", "contest_section");
    			add_location(span19, file$3, 376, 4, 12061);
    			attr_dev(div85, "class", "button");
    			add_location(div85, file$3, 378, 6, 12180);
    			attr_dev(a37, "href", "https://www.acmicpc.net/workbook/view/75");
    			attr_dev(a37, "target", "_blank");
    			add_location(a37, file$3, 377, 4, 12106);
    			attr_dev(div86, "class", "button");
    			add_location(div86, file$3, 380, 71, 12299);
    			attr_dev(a38, "href", "https://www.acmicpc.net/workbook/view/77");
    			attr_dev(a38, "target", "_blank");
    			add_location(a38, file$3, 380, 4, 12232);
    			attr_dev(div87, "class", "button_container");
    			add_location(div87, file$3, 375, 3, 12025);
    			attr_dev(div88, "class", "hl");
    			add_location(div88, file$3, 383, 3, 12359);
    			add_location(h38, file$3, 385, 3, 12384);
    			add_location(br8, file$3, 387, 40, 12455);
    			add_location(p21, file$3, 386, 3, 12410);
    			attr_dev(span20, "class", "contest_section");
    			add_location(span20, file$3, 391, 4, 12534);
    			attr_dev(div89, "class", "button");
    			add_location(div89, file$3, 393, 6, 12653);
    			attr_dev(a39, "href", "https://www.acmicpc.net/workbook/view/33");
    			attr_dev(a39, "target", "_blank");
    			add_location(a39, file$3, 392, 4, 12579);
    			attr_dev(div90, "class", "button");
    			add_location(div90, file$3, 395, 71, 12772);
    			attr_dev(a40, "href", "https://www.acmicpc.net/workbook/view/34");
    			attr_dev(a40, "target", "_blank");
    			add_location(a40, file$3, 395, 4, 12705);
    			attr_dev(div91, "class", "button_container");
    			add_location(div91, file$3, 390, 3, 12498);
    			attr_dev(div92, "class", "hl");
    			add_location(div92, file$3, 398, 3, 12832);
    			add_location(h39, file$3, 400, 3, 12857);
    			add_location(p22, file$3, 401, 3, 12883);
    			attr_dev(span21, "class", "contest_section");
    			add_location(span21, file$3, 403, 4, 12929);
    			attr_dev(div93, "class", "button");
    			add_location(div93, file$3, 405, 6, 13048);
    			attr_dev(a41, "href", "https://www.acmicpc.net/workbook/view/24");
    			attr_dev(a41, "target", "_blank");
    			add_location(a41, file$3, 404, 4, 12974);
    			attr_dev(div94, "class", "button");
    			add_location(div94, file$3, 407, 71, 13167);
    			attr_dev(a42, "href", "https://www.acmicpc.net/workbook/view/25");
    			attr_dev(a42, "target", "_blank");
    			add_location(a42, file$3, 407, 4, 13100);
    			attr_dev(div95, "class", "button_container");
    			add_location(div95, file$3, 402, 3, 12893);
    			attr_dev(div96, "class", "p75");
    			add_location(div96, file$3, 180, 2, 5100);
    			attr_dev(div97, "class", "row pad");
    			add_location(div97, file$3, 176, 1, 5022);
    			add_location(h28, file$3, 414, 3, 13291);
    			attr_dev(div98, "class", "pad_h");
    			add_location(div98, file$3, 413, 2, 13267);
    			attr_dev(ul2, "class", "tabs pad_h");
    			add_location(ul2, file$3, 417, 3, 13355);
    			attr_dev(div99, "class", "tabs_container");
    			add_location(div99, file$3, 416, 2, 13322);
    			attr_dev(div100, "class", "pad_v");
    			add_location(div100, file$3, 412, 1, 13244);
    			attr_dev(div101, "class", "history_contents");
    			add_location(div101, file$3, 422, 1, 13455);
    			attr_dev(div102, "class", "hr");
    			add_location(div102, file$3, 434, 1, 13716);
    			add_location(b1, file$3, 436, 2, 13758);
    			add_location(b2, file$3, 436, 17, 13773);
    			add_location(br9, file$3, 436, 39, 13795);
    			attr_dev(i4, "class", "award winner");
    			add_location(i4, file$3, 437, 2, 13805);
    			attr_dev(i5, "class", "award gold");
    			add_location(i5, file$3, 438, 2, 13850);
    			attr_dev(i6, "class", "award silver");
    			add_location(i6, file$3, 439, 2, 13894);
    			attr_dev(i7, "class", "award bronze");
    			add_location(i7, file$3, 440, 2, 13940);
    			add_location(br10, file$3, 440, 43, 13981);
    			attr_dev(div103, "class", "pad");
    			add_location(div103, file$3, 435, 1, 13737);
    			attr_dev(div104, "class", "contents");
    			add_location(div104, file$3, 31, 0, 705);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div104, anchor);
    			append_dev(div104, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, h1);
    			append_dev(div104, t3);
    			append_dev(div104, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h20);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div104, t7);
    			append_dev(div104, img0);
    			append_dev(div104, t8);
    			append_dev(div104, div6);
    			append_dev(div6, div4);
    			append_dev(div4, h21);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			append_dev(div5, p0);
    			append_dev(div5, t12);
    			append_dev(div5, p1);
    			append_dev(div104, t14);
    			append_dev(div104, div7);
    			append_dev(div104, t15);
    			append_dev(div104, div10);
    			append_dev(div10, div8);
    			append_dev(div8, h22);
    			append_dev(div10, t17);
    			append_dev(div10, div9);
    			append_dev(div9, p2);
    			append_dev(div104, t19);
    			append_dev(div104, div13);
    			append_dev(div13, div11);
    			append_dev(div11, h23);
    			append_dev(div13, t21);
    			append_dev(div13, div12);
    			append_dev(div12, p3);
    			append_dev(p3, t22);
    			append_dev(p3, b0);
    			append_dev(p3, t24);
    			append_dev(div12, t25);
    			append_dev(div12, p4);
    			append_dev(p4, t26);
    			append_dev(p4, i0);
    			append_dev(p4, t28);
    			append_dev(p4, i1);
    			append_dev(p4, t30);
    			append_dev(p4, i2);
    			append_dev(p4, t32);
    			append_dev(p4, i3);
    			append_dev(p4, t34);
    			append_dev(div12, t35);
    			append_dev(div12, p5);
    			append_dev(div12, t37);
    			append_dev(div12, p6);
    			append_dev(p6, t38);
    			append_dev(p6, a0);
    			append_dev(p6, t40);
    			append_dev(p6, a1);
    			append_dev(p6, t42);
    			append_dev(p6, a2);
    			append_dev(p6, t44);
    			append_dev(div12, t45);
    			append_dev(div12, p7);
    			append_dev(div104, t47);
    			append_dev(div104, div16);
    			append_dev(div16, div14);
    			append_dev(div14, h24);
    			append_dev(div16, t49);
    			append_dev(div16, div15);
    			append_dev(div15, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t51);
    			append_dev(ul0, li1);
    			append_dev(ul0, t53);
    			append_dev(ul0, li2);
    			append_dev(ul0, t55);
    			append_dev(ul0, li3);
    			append_dev(ul0, t57);
    			append_dev(ul0, li4);
    			append_dev(div15, t59);
    			append_dev(div15, p8);
    			append_dev(div104, t61);
    			append_dev(div104, div19);
    			append_dev(div19, div17);
    			append_dev(div17, h25);
    			append_dev(div19, t63);
    			append_dev(div19, div18);
    			append_dev(div18, ul1);
    			append_dev(ul1, li5);
    			append_dev(ul1, t65);
    			append_dev(ul1, li6);
    			append_dev(ul1, t67);
    			append_dev(ul1, li7);
    			append_dev(ul1, t69);
    			append_dev(ul1, li8);
    			append_dev(div104, t71);
    			append_dev(div104, div20);
    			append_dev(div104, t72);
    			append_dev(div104, div24);
    			append_dev(div24, div21);
    			append_dev(div21, h26);
    			append_dev(div24, t74);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, table);
    			append_dev(table, thead);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t76);
    			append_dev(tr0, th1);
    			append_dev(tr0, t78);
    			append_dev(tr0, th2);
    			append_dev(tr0, t80);
    			append_dev(tr0, th3);
    			append_dev(tr0, t82);
    			append_dev(tr0, th4);
    			append_dev(table, t84);
    			append_dev(table, tbody);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t86);
    			append_dev(tr1, td1);
    			append_dev(tr1, td2);
    			append_dev(tr1, td3);
    			append_dev(tr1, td4);
    			append_dev(tbody, t91);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td5);
    			append_dev(tr2, td6);
    			append_dev(tr2, td7);
    			append_dev(tr2, td8);
    			append_dev(tbody, t96);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td9);
    			append_dev(tr3, td10);
    			append_dev(tr3, td11);
    			append_dev(tr3, td12);
    			append_dev(tbody, t101);
    			append_dev(tbody, tr4);
    			append_dev(tr4, td13);
    			append_dev(tr4, td14);
    			append_dev(tr4, td15);
    			append_dev(tr4, td16);
    			append_dev(tbody, t106);
    			append_dev(tbody, tr5);
    			append_dev(tr5, td17);
    			append_dev(tr5, t108);
    			append_dev(tr5, td18);
    			append_dev(tr5, td19);
    			append_dev(tr5, td20);
    			append_dev(tr5, td21);
    			append_dev(tbody, t113);
    			append_dev(tbody, tr6);
    			append_dev(tr6, td22);
    			append_dev(tr6, td23);
    			append_dev(tr6, td24);
    			append_dev(tr6, td25);
    			append_dev(tbody, t118);
    			append_dev(tbody, tr7);
    			append_dev(tr7, td26);
    			append_dev(tr7, td27);
    			append_dev(tr7, td28);
    			append_dev(tr7, td29);
    			append_dev(table, t123);
    			append_dev(table, tfoot);
    			append_dev(tfoot, tr8);
    			append_dev(tr8, td30);
    			append_dev(tr8, td31);
    			append_dev(tr8, td32);
    			append_dev(div104, t127);
    			append_dev(div104, img1);
    			append_dev(div104, t128);
    			append_dev(div104, div97);
    			append_dev(div97, div25);
    			append_dev(div25, h27);
    			append_dev(div97, t130);
    			append_dev(div97, div96);
    			append_dev(div96, h30);
    			append_dev(div96, t132);
    			append_dev(div96, p9);
    			append_dev(p9, t133);
    			append_dev(p9, br0);
    			append_dev(p9, t134);
    			append_dev(div96, t135);
    			append_dev(div96, div28);
    			append_dev(div28, span1);
    			append_dev(div28, t137);
    			append_dev(div28, a3);
    			append_dev(a3, div26);
    			append_dev(div28, t139);
    			append_dev(div28, a4);
    			append_dev(a4, div27);
    			append_dev(div96, t141);
    			append_dev(div96, div31);
    			append_dev(div31, span2);
    			append_dev(div31, t143);
    			append_dev(div31, a5);
    			append_dev(a5, div29);
    			append_dev(div31, t145);
    			append_dev(div31, a6);
    			append_dev(a6, div30);
    			append_dev(div96, t147);
    			append_dev(div96, div34);
    			append_dev(div34, span3);
    			append_dev(div34, t149);
    			append_dev(div34, a7);
    			append_dev(a7, div32);
    			append_dev(div34, t151);
    			append_dev(div34, a8);
    			append_dev(a8, div33);
    			append_dev(div96, t153);
    			append_dev(div96, div36);
    			append_dev(div36, span4);
    			append_dev(div36, t155);
    			append_dev(div36, a9);
    			append_dev(a9, div35);
    			append_dev(div96, t157);
    			append_dev(div96, p10);
    			append_dev(div96, t159);
    			append_dev(div96, div37);
    			append_dev(div96, t160);
    			append_dev(div96, h31);
    			append_dev(div96, t162);
    			append_dev(div96, p11);
    			append_dev(p11, t163);
    			append_dev(p11, br1);
    			append_dev(p11, t164);
    			append_dev(div96, t165);
    			append_dev(div96, div40);
    			append_dev(div40, span5);
    			append_dev(div40, t167);
    			append_dev(div40, a10);
    			append_dev(a10, div38);
    			append_dev(div40, t169);
    			append_dev(div40, a11);
    			append_dev(a11, div39);
    			append_dev(div96, t171);
    			append_dev(div96, div43);
    			append_dev(div43, span6);
    			append_dev(div43, t173);
    			append_dev(div43, a12);
    			append_dev(a12, div41);
    			append_dev(div43, t175);
    			append_dev(div43, a13);
    			append_dev(a13, div42);
    			append_dev(div96, t177);
    			append_dev(div96, div46);
    			append_dev(div46, span7);
    			append_dev(div46, t179);
    			append_dev(div46, a14);
    			append_dev(a14, div44);
    			append_dev(div46, t181);
    			append_dev(div46, a15);
    			append_dev(a15, div45);
    			append_dev(div96, t183);
    			append_dev(div96, div48);
    			append_dev(div48, span8);
    			append_dev(div48, t185);
    			append_dev(div48, a16);
    			append_dev(a16, div47);
    			append_dev(div96, t187);
    			append_dev(div96, p12);
    			append_dev(div96, t189);
    			append_dev(div96, div49);
    			append_dev(div96, t190);
    			append_dev(div96, h32);
    			append_dev(div96, t192);
    			append_dev(div96, p13);
    			append_dev(p13, t193);
    			append_dev(p13, br2);
    			append_dev(p13, t194);
    			append_dev(div96, t195);
    			append_dev(div96, div52);
    			append_dev(div52, span9);
    			append_dev(div52, t197);
    			append_dev(div52, a17);
    			append_dev(a17, div50);
    			append_dev(div52, t199);
    			append_dev(div52, a18);
    			append_dev(a18, div51);
    			append_dev(div96, t201);
    			append_dev(div96, div55);
    			append_dev(div55, span10);
    			append_dev(div55, t203);
    			append_dev(div55, a19);
    			append_dev(a19, div53);
    			append_dev(div55, t205);
    			append_dev(div55, a20);
    			append_dev(a20, div54);
    			append_dev(div96, t207);
    			append_dev(div96, p14);
    			append_dev(div96, t209);
    			append_dev(div96, div56);
    			append_dev(div96, t210);
    			append_dev(div96, h33);
    			append_dev(div96, t212);
    			append_dev(div96, p15);
    			append_dev(p15, t213);
    			append_dev(p15, br3);
    			append_dev(p15, t214);
    			append_dev(div96, t215);
    			append_dev(div96, div59);
    			append_dev(div59, span11);
    			append_dev(div59, t217);
    			append_dev(div59, a21);
    			append_dev(a21, div57);
    			append_dev(div59, t219);
    			append_dev(div59, a22);
    			append_dev(a22, div58);
    			append_dev(div96, t221);
    			append_dev(div96, div62);
    			append_dev(div62, span12);
    			append_dev(div62, t223);
    			append_dev(div62, a23);
    			append_dev(a23, div60);
    			append_dev(div62, t225);
    			append_dev(div62, a24);
    			append_dev(a24, div61);
    			append_dev(div96, t227);
    			append_dev(div96, p16);
    			append_dev(div96, t229);
    			append_dev(div96, div63);
    			append_dev(div96, t230);
    			append_dev(div96, h34);
    			append_dev(div96, t232);
    			append_dev(div96, p17);
    			append_dev(p17, t233);
    			append_dev(p17, br4);
    			append_dev(p17, t234);
    			append_dev(div96, t235);
    			append_dev(div96, div66);
    			append_dev(div66, span13);
    			append_dev(div66, t237);
    			append_dev(div66, a25);
    			append_dev(a25, div64);
    			append_dev(div66, t239);
    			append_dev(div66, a26);
    			append_dev(a26, div65);
    			append_dev(div96, t241);
    			append_dev(div96, div69);
    			append_dev(div69, span14);
    			append_dev(div69, t243);
    			append_dev(div69, a27);
    			append_dev(a27, div67);
    			append_dev(div69, t245);
    			append_dev(div69, a28);
    			append_dev(a28, div68);
    			append_dev(div96, t247);
    			append_dev(div96, div70);
    			append_dev(div96, t248);
    			append_dev(div96, h35);
    			append_dev(div96, t250);
    			append_dev(div96, p18);
    			append_dev(p18, t251);
    			append_dev(p18, br5);
    			append_dev(p18, t252);
    			append_dev(div96, t253);
    			append_dev(div96, div73);
    			append_dev(div73, span15);
    			append_dev(div73, t255);
    			append_dev(div73, a29);
    			append_dev(a29, div71);
    			append_dev(div73, t257);
    			append_dev(div73, a30);
    			append_dev(a30, div72);
    			append_dev(div96, t259);
    			append_dev(div96, div76);
    			append_dev(div76, span16);
    			append_dev(div76, t261);
    			append_dev(div76, a31);
    			append_dev(a31, div74);
    			append_dev(div76, t263);
    			append_dev(div76, a32);
    			append_dev(a32, div75);
    			append_dev(div96, t265);
    			append_dev(div96, div77);
    			append_dev(div96, t266);
    			append_dev(div96, h36);
    			append_dev(div96, t268);
    			append_dev(div96, p19);
    			append_dev(p19, t269);
    			append_dev(p19, br6);
    			append_dev(p19, t270);
    			append_dev(div96, t271);
    			append_dev(div96, div80);
    			append_dev(div80, span17);
    			append_dev(div80, t273);
    			append_dev(div80, a33);
    			append_dev(a33, div78);
    			append_dev(div80, t275);
    			append_dev(div80, a34);
    			append_dev(a34, div79);
    			append_dev(div96, t277);
    			append_dev(div96, div83);
    			append_dev(div83, span18);
    			append_dev(div83, t279);
    			append_dev(div83, a35);
    			append_dev(a35, div81);
    			append_dev(div83, t281);
    			append_dev(div83, a36);
    			append_dev(a36, div82);
    			append_dev(div96, t283);
    			append_dev(div96, div84);
    			append_dev(div96, t284);
    			append_dev(div96, h37);
    			append_dev(div96, t286);
    			append_dev(div96, p20);
    			append_dev(p20, t287);
    			append_dev(p20, br7);
    			append_dev(p20, t288);
    			append_dev(div96, t289);
    			append_dev(div96, div87);
    			append_dev(div87, span19);
    			append_dev(div87, t291);
    			append_dev(div87, a37);
    			append_dev(a37, div85);
    			append_dev(div87, t293);
    			append_dev(div87, a38);
    			append_dev(a38, div86);
    			append_dev(div96, t295);
    			append_dev(div96, div88);
    			append_dev(div96, t296);
    			append_dev(div96, h38);
    			append_dev(div96, t298);
    			append_dev(div96, p21);
    			append_dev(p21, t299);
    			append_dev(p21, br8);
    			append_dev(p21, t300);
    			append_dev(div96, t301);
    			append_dev(div96, div91);
    			append_dev(div91, span20);
    			append_dev(div91, t303);
    			append_dev(div91, a39);
    			append_dev(a39, div89);
    			append_dev(div91, t305);
    			append_dev(div91, a40);
    			append_dev(a40, div90);
    			append_dev(div96, t307);
    			append_dev(div96, div92);
    			append_dev(div96, t308);
    			append_dev(div96, h39);
    			append_dev(div96, t310);
    			append_dev(div96, p22);
    			append_dev(div96, t311);
    			append_dev(div96, div95);
    			append_dev(div95, span21);
    			append_dev(div95, t313);
    			append_dev(div95, a41);
    			append_dev(a41, div93);
    			append_dev(div95, t315);
    			append_dev(div95, a42);
    			append_dev(a42, div94);
    			append_dev(div104, t317);
    			append_dev(div104, div100);
    			append_dev(div100, div98);
    			append_dev(div98, h28);
    			append_dev(div100, t319);
    			append_dev(div100, div99);
    			append_dev(div99, ul2);
    			mount_component(historytab, ul2, null);
    			append_dev(div104, t320);
    			append_dev(div104, div101);
    			if (if_block) if_block.m(div101, null);
    			append_dev(div104, t321);
    			append_dev(div104, div102);
    			append_dev(div104, t322);
    			append_dev(div104, div103);
    			append_dev(div103, b1);
    			append_dev(div103, t324);
    			append_dev(div103, b2);
    			append_dev(div103, t326);
    			append_dev(div103, br9);
    			append_dev(div103, t327);
    			append_dev(div103, i4);
    			append_dev(div103, t329);
    			append_dev(div103, i5);
    			append_dev(div103, t331);
    			append_dev(div103, i6);
    			append_dev(div103, t333);
    			append_dev(div103, i7);
    			append_dev(div103, t335);
    			append_dev(div103, br10);
    			append_dev(div103, t336);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const historytab_changes = {};
    			if (dirty & /*yearsList*/ 4) historytab_changes.yearsList = /*yearsList*/ ctx[2];

    			if (!updating_curYear && dirty & /*curYear*/ 1) {
    				updating_curYear = true;
    				historytab_changes.curYear = /*curYear*/ ctx[0];
    				add_flush_callback(() => updating_curYear = false);
    			}

    			historytab.$set(historytab_changes);

    			if (/*spcData*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*spcData*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div101, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(historytab.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(historytab.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div104);
    			destroy_component(historytab);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Spc", slots, []);
    	let spcData;
    	let yearsList, curYear = `2020`;

    	fetch(`/spc/data/years.json`).then(res => {
    		return res.json();
    	}).then(data => {
    		$$invalidate(2, yearsList = data);
    	});

    	onMount(() => {
    		document.body.scrollTop = 0;
    		document.documentElement.scrollTop = 0;
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Spc> was created with unknown prop '${key}'`);
    	});

    	function historytab_curYear_binding(value) {
    		curYear = value;
    		$$invalidate(0, curYear);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		HistoryTable,
    		HistoryTab,
    		spcData,
    		yearsList,
    		curYear
    	});

    	$$self.$inject_state = $$props => {
    		if ("spcData" in $$props) $$invalidate(1, spcData = $$props.spcData);
    		if ("yearsList" in $$props) $$invalidate(2, yearsList = $$props.yearsList);
    		if ("curYear" in $$props) $$invalidate(0, curYear = $$props.curYear);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*curYear*/ 1) {
    			// Re-fetch Whenever curYear Changes In HistoryTab Component
    			fetch(`/spc/data/${curYear.trim()}.json`).then(res => {
    				return res.json();
    			}).then(data => {
    				$$invalidate(1, spcData = data);
    			});
    		}
    	};

    	return [curYear, spcData, yearsList, historytab_curYear_binding];
    }

    class Spc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spc",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\routes\Contact\Contact.svelte generated by Svelte v3.34.0 */
    const file$2 = "src\\routes\\Contact\\Contact.svelte";

    function create_fragment$2(ctx) {
    	let div16;
    	let div0;
    	let span0;
    	let t1;
    	let h1;
    	let t3;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let div3;
    	let div1;
    	let h20;
    	let t6;
    	let div2;
    	let p0;
    	let t7;
    	let br0;
    	let br1;
    	let t8;
    	let br2;
    	let t9;
    	let a0;
    	let t11;
    	let div4;
    	let t12;
    	let div7;
    	let div5;
    	let h21;
    	let t14;
    	let div6;
    	let p1;
    	let t16;
    	let p2;
    	let t17;
    	let a1;
    	let t19;
    	let t20;
    	let div8;
    	let t21;
    	let div11;
    	let div9;
    	let h22;
    	let t23;
    	let div10;
    	let p3;
    	let t24;
    	let a2;
    	let t26;
    	let br3;
    	let t27;
    	let span1;
    	let t29;
    	let img1;
    	let img1_src_value;
    	let t30;
    	let img2;
    	let img2_src_value;
    	let t31;
    	let div12;
    	let t32;
    	let div15;
    	let div13;
    	let h23;
    	let t34;
    	let div14;
    	let h3;
    	let t36;
    	let table;
    	let tr0;
    	let td0;
    	let t38;
    	let td1;
    	let t40;
    	let td2;
    	let t42;
    	let tr1;
    	let td3;
    	let t44;
    	let td4;
    	let t46;
    	let td5;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "가입 및 문의";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "서강대학교 학부생이라면 누구나 함께할 수 있습니다.";
    			t3 = space();
    			img0 = element("img");
    			t4 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "가입";
    			t6 = space();
    			div2 = element("div");
    			p0 = element("p");
    			t7 = text("현재 2021년 1학기 신규 학회원 모집이 진행중입니다. 지원 마감은 3/7(일)까지이며, 3/9(화)~11(목)에 면접을\r\n\t\t\t\t통해 선발됩니다.");
    			br0 = element("br");
    			br1 = element("br");
    			t8 = text("\r\n\t\t\t\t아래 폼에서 지원하실 수 있습니다.");
    			br2 = element("br");
    			t9 = space();
    			a0 = element("a");
    			a0.textContent = "https://forms.gle/vNVSohnSXRsEWFgXA";
    			t11 = space();
    			div4 = element("div");
    			t12 = space();
    			div7 = element("div");
    			div5 = element("div");
    			h21 = element("h2");
    			h21.textContent = "문의";
    			t14 = space();
    			div6 = element("div");
    			p1 = element("p");
    			p1.textContent = "질문은 언제나 환영합니다!";
    			t16 = space();
    			p2 = element("p");
    			t17 = text("학회 관련, 프로그래밍 대회 관련, ICPC 관련해 궁금한 점이 있으시다면 언제든 sogang@acmicpc.team 혹은 ");
    			a1 = element("a");
    			a1.textContent = "카카오톡 플러스친구";
    			t19 = text("로 문의 부탁드립니다.");
    			t20 = space();
    			div8 = element("div");
    			t21 = space();
    			div11 = element("div");
    			div9 = element("div");
    			h22 = element("h2");
    			h22.textContent = "랩 위치";
    			t23 = space();
    			div10 = element("div");
    			p3 = element("p");
    			t24 = text("K512 랩은\r\n\t\t\t\t");
    			a2 = element("a");
    			a2.textContent = "서강대학교 김대건관";
    			t26 = text("\r\n\t\t\t\t5층 중간 즈음에 위치하고 있습니다.\r\n\t\t\t\t");
    			br3 = element("br");
    			t27 = space();
    			span1 = element("span");
    			span1.textContent = "코로나 바이러스로 인해 랩실 개방은 계획에 없습니다.";
    			t29 = space();
    			img1 = element("img");
    			t30 = space();
    			img2 = element("img");
    			t31 = space();
    			div12 = element("div");
    			t32 = space();
    			div15 = element("div");
    			div13 = element("div");
    			h23 = element("h2");
    			h23.textContent = "회장단";
    			t34 = space();
    			div14 = element("div");
    			h3 = element("h3");
    			h3.textContent = "2021년 - 현재";
    			t36 = space();
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "이민희";
    			t38 = space();
    			td1 = element("td");
    			td1.textContent = "학회장";
    			t40 = space();
    			td2 = element("td");
    			td2.textContent = "minigimbob@gmail.com";
    			t42 = space();
    			tr1 = element("tr");
    			td3 = element("td");
    			td3.textContent = "이동주";
    			t44 = space();
    			td4 = element("td");
    			td4.textContent = "부학회장";
    			t46 = space();
    			td5 = element("td");
    			td5.textContent = "nant0313@gmail.com";
    			attr_dev(span0, "class", "subtitle");
    			add_location(span0, file$2, 11, 2, 206);
    			add_location(h1, file$2, 12, 2, 247);
    			attr_dev(div0, "class", "pad");
    			add_location(div0, file$2, 10, 1, 185);
    			attr_dev(img0, "class", "pad");
    			if (img0.src !== (img0_src_value = "/res/labk512.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "K512 PC Lab");
    			add_location(img0, file$2, 14, 1, 296);
    			add_location(h20, file$2, 17, 3, 406);
    			attr_dev(div1, "class", "p25");
    			add_location(div1, file$2, 16, 2, 384);
    			add_location(br0, file$2, 22, 13, 545);
    			add_location(br1, file$2, 22, 19, 551);
    			add_location(br2, file$2, 23, 23, 582);
    			attr_dev(a0, "href", "https://forms.gle/vNVSohnSXRsEWFgXA");
    			add_location(a0, file$2, 24, 4, 594);
    			add_location(p0, file$2, 20, 3, 453);
    			attr_dev(div2, "class", "p75");
    			add_location(div2, file$2, 19, 2, 431);
    			attr_dev(div3, "class", "row pad");
    			add_location(div3, file$2, 15, 1, 359);
    			attr_dev(div4, "class", "hr");
    			add_location(div4, file$2, 28, 1, 710);
    			add_location(h21, file$2, 31, 3, 778);
    			attr_dev(div5, "class", "p25");
    			add_location(div5, file$2, 30, 2, 756);
    			add_location(p1, file$2, 34, 3, 825);
    			attr_dev(a1, "href", "https://pf.kakao.com/_xewSPK");
    			set_style(a1, "word-break", "keep-all");
    			add_location(a1, file$2, 36, 73, 929);
    			add_location(p2, file$2, 35, 3, 851);
    			attr_dev(div6, "class", "p75");
    			add_location(div6, file$2, 33, 2, 803);
    			attr_dev(div7, "class", "row pad");
    			add_location(div7, file$2, 29, 1, 731);
    			attr_dev(div8, "class", "hr");
    			add_location(div8, file$2, 43, 1, 1073);
    			add_location(h22, file$2, 46, 3, 1141);
    			attr_dev(div9, "class", "p25");
    			add_location(div9, file$2, 45, 2, 1119);
    			attr_dev(a2, "href", "https://www.google.com/maps/place/%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%90+%EA%B9%80%EB%8C%80%EA%B1%B4%EA%B4%80/@37.5500361,126.940057,15z/data=!4m5!3m4!1s0x0:0x64853caa3a841c2b!8m2!3d37.5500361!4d126.940057");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$2, 51, 4, 1212);
    			add_location(br3, file$2, 56, 4, 1515);
    			add_location(span1, file$2, 57, 4, 1527);
    			add_location(p3, file$2, 49, 3, 1190);
    			if (img1.src !== (img1_src_value = "/res/map-sogang.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "서강대학교 약도");
    			add_location(img1, file$2, 60, 3, 1596);
    			if (img2.src !== (img2_src_value = "/res/map-k.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "K관 약도");
    			add_location(img2, file$2, 62, 3, 1651);
    			attr_dev(div10, "class", "p75");
    			add_location(div10, file$2, 48, 2, 1168);
    			attr_dev(div11, "class", "row pad");
    			add_location(div11, file$2, 44, 1, 1094);
    			attr_dev(div12, "class", "hr");
    			add_location(div12, file$2, 65, 1, 1713);
    			add_location(h23, file$2, 68, 3, 1781);
    			attr_dev(div13, "class", "p25");
    			add_location(div13, file$2, 67, 2, 1759);
    			add_location(h3, file$2, 71, 3, 1829);
    			add_location(td0, file$2, 74, 5, 1902);
    			add_location(td1, file$2, 75, 5, 1921);
    			add_location(td2, file$2, 76, 5, 1940);
    			add_location(tr0, file$2, 73, 4, 1891);
    			add_location(td3, file$2, 79, 5, 1997);
    			add_location(td4, file$2, 80, 5, 2016);
    			add_location(td5, file$2, 81, 5, 2036);
    			add_location(tr1, file$2, 78, 4, 1986);
    			set_style(table, "margin-top", "16px");
    			add_location(table, file$2, 72, 3, 1853);
    			attr_dev(div14, "class", "p75");
    			add_location(div14, file$2, 70, 2, 1807);
    			attr_dev(div15, "class", "row pad");
    			add_location(div15, file$2, 66, 1, 1734);
    			attr_dev(div16, "class", "contents");
    			add_location(div16, file$2, 9, 0, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, h1);
    			append_dev(div16, t3);
    			append_dev(div16, img0);
    			append_dev(div16, t4);
    			append_dev(div16, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h20);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, p0);
    			append_dev(p0, t7);
    			append_dev(p0, br0);
    			append_dev(p0, br1);
    			append_dev(p0, t8);
    			append_dev(p0, br2);
    			append_dev(p0, t9);
    			append_dev(p0, a0);
    			append_dev(div16, t11);
    			append_dev(div16, div4);
    			append_dev(div16, t12);
    			append_dev(div16, div7);
    			append_dev(div7, div5);
    			append_dev(div5, h21);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, p1);
    			append_dev(div6, t16);
    			append_dev(div6, p2);
    			append_dev(p2, t17);
    			append_dev(p2, a1);
    			append_dev(p2, t19);
    			append_dev(div16, t20);
    			append_dev(div16, div8);
    			append_dev(div16, t21);
    			append_dev(div16, div11);
    			append_dev(div11, div9);
    			append_dev(div9, h22);
    			append_dev(div11, t23);
    			append_dev(div11, div10);
    			append_dev(div10, p3);
    			append_dev(p3, t24);
    			append_dev(p3, a2);
    			append_dev(p3, t26);
    			append_dev(p3, br3);
    			append_dev(p3, t27);
    			append_dev(p3, span1);
    			append_dev(div10, t29);
    			append_dev(div10, img1);
    			append_dev(div10, t30);
    			append_dev(div10, img2);
    			append_dev(div16, t31);
    			append_dev(div16, div12);
    			append_dev(div16, t32);
    			append_dev(div16, div15);
    			append_dev(div15, div13);
    			append_dev(div13, h23);
    			append_dev(div15, t34);
    			append_dev(div15, div14);
    			append_dev(div14, h3);
    			append_dev(div14, t36);
    			append_dev(div14, table);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t38);
    			append_dev(tr0, td1);
    			append_dev(tr0, t40);
    			append_dev(tr0, td2);
    			append_dev(table, t42);
    			append_dev(table, tr1);
    			append_dev(tr1, td3);
    			append_dev(tr1, t44);
    			append_dev(tr1, td4);
    			append_dev(tr1, t46);
    			append_dev(tr1, td5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Contact", slots, []);

    	onMount(() => {
    		document.body.scrollTop = 0;
    		document.documentElement.scrollTop = 0;
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount });
    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\routes\Introduction\Introduction.svelte generated by Svelte v3.34.0 */
    const file$1 = "src\\routes\\Introduction\\Introduction.svelte";

    function create_fragment$1(ctx) {
    	let div35;
    	let div0;
    	let span;
    	let t1;
    	let h1;
    	let t3;
    	let div3;
    	let div1;
    	let h20;
    	let t5;
    	let div2;
    	let t7;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let div8;
    	let div4;
    	let h21;
    	let t10;
    	let div7;
    	let p0;
    	let a0;
    	let t12;
    	let t13;
    	let p1;
    	let t15;
    	let div6;
    	let a1;
    	let div5;
    	let t17;
    	let div13;
    	let div9;
    	let h22;
    	let t19;
    	let div12;
    	let p2;
    	let t20;
    	let a2;
    	let t22;
    	let a3;
    	let t24;
    	let a4;
    	let t26;
    	let t27;
    	let p3;
    	let t28;
    	let a5;
    	let t30;
    	let t31;
    	let div11;
    	let a6;
    	let div10;
    	let t33;
    	let img1;
    	let img1_src_value;
    	let t34;
    	let div16;
    	let div14;
    	let h23;
    	let t36;
    	let div15;
    	let p4;
    	let t38;
    	let p5;
    	let t39;
    	let a7;
    	let t41;
    	let t42;
    	let div22;
    	let div17;
    	let h24;
    	let t44;
    	let div21;
    	let p6;
    	let a8;
    	let t46;
    	let a9;
    	let t48;
    	let a10;
    	let t50;
    	let t51;
    	let div20;
    	let a11;
    	let div18;
    	let t53;
    	let a12;
    	let div19;
    	let t55;
    	let div27;
    	let div23;
    	let h25;
    	let t57;
    	let div26;
    	let p7;
    	let t58;
    	let a13;
    	let t60;
    	let t61;
    	let p8;
    	let t63;
    	let div25;
    	let a14;
    	let div24;
    	let t65;
    	let div30;
    	let div28;
    	let h26;
    	let t67;
    	let div29;
    	let p9;
    	let t69;
    	let div31;
    	let t70;
    	let div34;
    	let div32;
    	let h27;
    	let t72;
    	let div33;
    	let p10;
    	let t73;
    	let a15;
    	let t75;
    	let t76;
    	let img2;
    	let img2_src_value;
    	let t77;
    	let img3;
    	let img3_src_value;

    	const block = {
    		c: function create() {
    			div35 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "소개";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "우리는 알고리즘을 공부하고, 알고리즘으로 문제를 해결합니다.";
    			t3 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "이곳은";
    			t5 = space();
    			div2 = element("div");
    			div2.textContent = "컴퓨터과학과 소프트웨어 공학의 근간이 되는, 알고리즘을 공부하는 서강대학교 컴퓨터공학과 학회입니다. 2005년에\r\n\t\t\t이한승, 심재은, 김영욱 동문께서 주축이 되어 ICPC 출전을 준비하기 위해 Sogang ACM-ICPC Team으로 시작해서,\r\n\t\t\t지금은 ICPC 뿐만 아니라 Google Code Jam, SCPC, Kakao Code Festival 등 여러 대회에 참가하고 있습니다. 또한\r\n\t\t\t교내 대회인 Sogang Programming Contest를 주관하고 있습니다.";
    			t7 = space();
    			img0 = element("img");
    			t8 = space();
    			div8 = element("div");
    			div4 = element("div");
    			h21 = element("h2");
    			h21.textContent = "ICPC 참가";
    			t10 = space();
    			div7 = element("div");
    			p0 = element("p");
    			a0 = element("a");
    			a0.textContent = "ICPC";
    			t12 = text("(International Collegiate Programming\r\n\t\t\t\tContest)는 국제 대학생 프로그래밍 경시대회로, 가장 긴 역사를 가지고 있는 권위 있는 프로그래밍\r\n\t\t\t\t대회입니다. 학부생 3명이 한 팀을 구성해 참가해 제한된 시간 내에 주어진 문제들을 프로그래밍으로 해결해야\r\n\t\t\t\t합니다. 학회의 이름에서 보이듯이 매년 이 대회에 참가하는 것이 학회 활동의 주 목적 중 하나이기도 합니다.");
    			t13 = space();
    			p1 = element("p");
    			p1.textContent = "Sogang ICPC Team이 생긴 2007년부터 지금까지 매년 한국 지역 본선에 꾸준히 참가해 왔고, 우수한 성적을\r\n\t\t\t\t거두고 있습니다.";
    			t15 = space();
    			div6 = element("div");
    			a1 = element("a");
    			div5 = element("div");
    			div5.textContent = "참여 기록";
    			t17 = space();
    			div13 = element("div");
    			div9 = element("div");
    			h22 = element("h2");
    			h22.textContent = "프로그래밍 대회 참가";
    			t19 = space();
    			div12 = element("div");
    			p2 = element("p");
    			t20 = text("Google ");
    			a2 = element("a");
    			a2.textContent = "Code Jam";
    			t22 = text(", 삼성\r\n\t\t\t\t");
    			a3 = element("a");
    			a3.textContent = "대학생 프로그래밍 경진대회";
    			t24 = text("(SCPC), Kakao\r\n\t\t\t\t");
    			a4 = element("a");
    			a4.textContent = "Code Festival";
    			t26 = text(" 등 여러 기업 주최 오프라인 대회에도\r\n\t\t\t\t참가하고 있습니다.");
    			t27 = space();
    			p3 = element("p");
    			t28 = text("또한 전국 대학생 프로그래밍 대회 동아리 연합 (전대프연)\r\n\t\t\t\t");
    			a5 = element("a");
    			a5.textContent = "프로그래밍 대회";
    			t30 = text("(UCPC) 등의 대회에도 참가하고\r\n\t\t\t\t있습니다.");
    			t31 = space();
    			div11 = element("div");
    			a6 = element("a");
    			div10 = element("div");
    			div10.textContent = "참여 기록";
    			t33 = space();
    			img1 = element("img");
    			t34 = space();
    			div16 = element("div");
    			div14 = element("div");
    			h23 = element("h2");
    			h23.textContent = "알고리즘 스터디";
    			t36 = space();
    			div15 = element("div");
    			p4 = element("p");
    			p4.textContent = "학회에 같이 모여서 알고리즘 공부를 합니다. 학회원들의 문제 해결 능력을 업그레이드하기 위해 매 학기\r\n\t\t\t\t알고리즘 스터디를 진행합니다.";
    			t38 = space();
    			p5 = element("p");
    			t39 = text("스터디는 수준에 따라 초급, 중급, 고급으로 나뉘어져 있고, 주로\r\n\t\t\t\t");
    			a7 = element("a");
    			a7.textContent = "Baekjoon OJ";
    			t41 = text("에서 문제를 푸는 방식으로 진행됩니다.\r\n\t\t\t\t학회원 누구나 자유롭게 참여할 수 있습니다. 계절학기에도 쉬지 않고 진행합니다!");
    			t42 = space();
    			div22 = element("div");
    			div17 = element("div");
    			h24 = element("h2");
    			h24.textContent = "문제 해결";
    			t44 = space();
    			div21 = element("div");
    			p6 = element("p");
    			a8 = element("a");
    			a8.textContent = "Baekjoon OJ";
    			t46 = text(" 등의 온라인 저지에 있는 많은 문제들을\r\n\t\t\t\t해결해 나갑니다. 또한 ");
    			a9 = element("a");
    			a9.textContent = "Codeforces";
    			t48 = text(",\r\n\t\t\t\t");
    			a10 = element("a");
    			a10.textContent = "AtCoder";
    			t50 = text(" 등에서 주기적으로 열리는 많은 온라인 대회에도 꾸준히\r\n\t\t\t\t참가하면서 알고리즘 실력을 함께 키워나갑니다.");
    			t51 = space();
    			div20 = element("div");
    			a11 = element("a");
    			div18 = element("div");
    			div18.textContent = "BOJ 랭킹";
    			t53 = space();
    			a12 = element("a");
    			div19 = element("div");
    			div19.textContent = "Codeforces 랭킹";
    			t55 = space();
    			div27 = element("div");
    			div23 = element("div");
    			h25 = element("h2");
    			h25.textContent = "SPC 주관";
    			t57 = space();
    			div26 = element("div");
    			p7 = element("p");
    			t58 = text("ICPC 한국 지역 본선 1, 2위 수상팀은 매년 열리는 교내 프로그래밍 대회\r\n\t\t\t\t");
    			a13 = element("a");
    			a13.textContent = "Sogang Programming Contest";
    			t60 = text("를 주관합니다. 대회 전반을 준비하고,\r\n\t\t\t\t문제도 출제합니다.");
    			t61 = space();
    			p8 = element("p");
    			p8.textContent = "Sogang Programming Contest는 서강대학교 학부생이라면 누구나 참가할 수 있습니다.";
    			t63 = space();
    			div25 = element("div");
    			a14 = element("a");
    			div24 = element("div");
    			div24.textContent = "대회 정보";
    			t65 = space();
    			div30 = element("div");
    			div28 = element("div");
    			h26 = element("h2");
    			h26.textContent = "랩 관리";
    			t67 = space();
    			div29 = element("div");
    			p9 = element("p");
    			p9.textContent = "김대건관 컴퓨터공학과 실습실 K512를 관리합니다.";
    			t69 = space();
    			div31 = element("div");
    			t70 = space();
    			div34 = element("div");
    			div32 = element("div");
    			h27 = element("h2");
    			h27.textContent = "랩 위치";
    			t72 = space();
    			div33 = element("div");
    			p10 = element("p");
    			t73 = text("K512 랩은\r\n\t\t\t\t");
    			a15 = element("a");
    			a15.textContent = "서강대학교 김대건관";
    			t75 = text("\r\n\t\t\t\t5층 중간 즈음에 위치하고 있습니다.");
    			t76 = space();
    			img2 = element("img");
    			t77 = space();
    			img3 = element("img");
    			attr_dev(span, "class", "subtitle");
    			add_location(span, file$1, 11, 2, 206);
    			add_location(h1, file$1, 12, 2, 242);
    			attr_dev(div0, "class", "pad");
    			add_location(div0, file$1, 10, 1, 185);
    			add_location(h20, file$1, 16, 3, 359);
    			attr_dev(div1, "class", "p25");
    			add_location(div1, file$1, 15, 2, 337);
    			attr_dev(div2, "class", "p75");
    			add_location(div2, file$1, 18, 2, 385);
    			attr_dev(div3, "class", "row pad first_paragraph");
    			add_location(div3, file$1, 14, 1, 296);
    			attr_dev(img0, "class", "pad");
    			if (img0.src !== (img0_src_value = "/res/icpc2019-redshift.jpg")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$1, 25, 1, 703);
    			add_location(h21, file$1, 28, 3, 805);
    			attr_dev(div4, "class", "p25");
    			add_location(div4, file$1, 27, 2, 783);
    			attr_dev(a0, "href", "https://icpc.baylor.edu/");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$1, 32, 4, 866);
    			add_location(p0, file$1, 31, 3, 857);
    			add_location(p1, file$1, 37, 3, 1170);
    			attr_dev(div5, "class", "button");
    			add_location(div5, file$1, 42, 40, 1346);
    			attr_dev(a1, "href", "/history/");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$1, 42, 4, 1310);
    			attr_dev(div6, "class", "button_container");
    			add_location(div6, file$1, 41, 3, 1274);
    			attr_dev(div7, "class", "p75");
    			add_location(div7, file$1, 30, 2, 835);
    			attr_dev(div8, "class", "row pad");
    			add_location(div8, file$1, 26, 1, 758);
    			add_location(h22, file$1, 48, 3, 1461);
    			attr_dev(div9, "class", "p25");
    			add_location(div9, file$1, 47, 2, 1439);
    			attr_dev(a2, "href", "https://codingcompetitions.withgoogle.com/codejam/");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$1, 52, 11, 1533);
    			attr_dev(a3, "href", "https://www.codeground.org/");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$1, 53, 4, 1632);
    			attr_dev(a4, "href", "https://www.kakaocode.com/");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$1, 54, 4, 1723);
    			add_location(p2, file$1, 51, 3, 1517);
    			attr_dev(a5, "href", "https://2018.ucpc.io/");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$1, 59, 4, 1891);
    			add_location(p3, file$1, 57, 3, 1844);
    			attr_dev(div10, "class", "button");
    			add_location(div10, file$1, 63, 40, 2067);
    			attr_dev(a6, "href", "/history/");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file$1, 63, 4, 2031);
    			attr_dev(div11, "class", "button_container");
    			add_location(div11, file$1, 62, 3, 1995);
    			attr_dev(div12, "class", "p75");
    			add_location(div12, file$1, 50, 2, 1495);
    			attr_dev(div13, "class", "row pad");
    			add_location(div13, file$1, 46, 1, 1414);
    			attr_dev(img1, "class", "pad");
    			if (img1.src !== (img1_src_value = "/res/acm-solving.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Problem solving");
    			add_location(img1, file$1, 67, 1, 2135);
    			add_location(h23, file$1, 70, 3, 2253);
    			attr_dev(div14, "class", "p25");
    			add_location(div14, file$1, 69, 2, 2231);
    			add_location(p4, file$1, 73, 3, 2306);
    			attr_dev(a7, "href", "https://www.acmicpc.net/");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file$1, 79, 4, 2458);
    			add_location(p5, file$1, 77, 3, 2407);
    			attr_dev(div15, "class", "p75");
    			add_location(div15, file$1, 72, 2, 2284);
    			attr_dev(div16, "class", "row pad");
    			add_location(div16, file$1, 68, 1, 2206);
    			add_location(h24, file$1, 86, 3, 2673);
    			attr_dev(div17, "class", "p25");
    			add_location(div17, file$1, 85, 2, 2651);
    			attr_dev(a8, "href", "https://www.acmicpc.net/");
    			attr_dev(a8, "target", "_blank");
    			add_location(a8, file$1, 90, 4, 2732);
    			attr_dev(a9, "href", "https://codeforces.com/");
    			attr_dev(a9, "target", "_blank");
    			add_location(a9, file$1, 91, 17, 2839);
    			attr_dev(a10, "href", "https://atcoder.jp/");
    			attr_dev(a10, "target", "_blank");
    			add_location(a10, file$1, 92, 4, 2910);
    			add_location(p6, file$1, 89, 3, 2723);
    			attr_dev(div18, "class", "button");
    			add_location(div18, file$1, 97, 6, 3155);
    			attr_dev(a11, "href", "https://www.acmicpc.net/school/ranklist/292");
    			attr_dev(a11, "target", "_blank");
    			add_location(a11, file$1, 96, 4, 3078);
    			attr_dev(div19, "class", "button");
    			add_location(div19, file$1, 100, 6, 3285);
    			attr_dev(a12, "href", "https://codeforces.com/ratings/organization/1637");
    			attr_dev(a12, "target", "_blank");
    			add_location(a12, file$1, 99, 4, 3203);
    			attr_dev(div20, "class", "button_container");
    			add_location(div20, file$1, 95, 3, 3042);
    			attr_dev(div21, "class", "p75");
    			add_location(div21, file$1, 88, 2, 2701);
    			attr_dev(div22, "class", "row pad");
    			add_location(div22, file$1, 84, 1, 2626);
    			add_location(h25, file$1, 107, 3, 3414);
    			attr_dev(div23, "class", "p25");
    			add_location(div23, file$1, 106, 2, 3392);
    			attr_dev(a13, "href", "/spc/");
    			attr_dev(a13, "target", "_blank");
    			add_location(a13, file$1, 112, 4, 3523);
    			add_location(p7, file$1, 110, 3, 3465);
    			add_location(p8, file$1, 115, 3, 3636);
    			attr_dev(div24, "class", "button");
    			add_location(div24, file$1, 117, 36, 3772);
    			attr_dev(a14, "href", "/spc/");
    			attr_dev(a14, "target", "_blank");
    			add_location(a14, file$1, 117, 4, 3740);
    			attr_dev(div25, "class", "button_container");
    			add_location(div25, file$1, 116, 3, 3704);
    			attr_dev(div26, "class", "p75");
    			add_location(div26, file$1, 109, 2, 3443);
    			attr_dev(div27, "class", "row pad");
    			add_location(div27, file$1, 105, 1, 3367);
    			add_location(h26, file$1, 123, 3, 3887);
    			attr_dev(div28, "class", "p25");
    			add_location(div28, file$1, 122, 2, 3865);
    			add_location(p9, file$1, 126, 3, 3936);
    			attr_dev(div29, "class", "p75");
    			add_location(div29, file$1, 125, 2, 3914);
    			attr_dev(div30, "class", "row pad");
    			add_location(div30, file$1, 121, 1, 3840);
    			attr_dev(div31, "class", "hr");
    			add_location(div31, file$1, 129, 1, 3993);
    			add_location(h27, file$1, 132, 3, 4061);
    			attr_dev(div32, "class", "p25");
    			add_location(div32, file$1, 131, 2, 4039);
    			attr_dev(a15, "href", "https://www.google.com/maps/place/%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%90+%EA%B9%80%EB%8C%80%EA%B1%B4%EA%B4%80/@37.5500361,126.940057,15z/data=!4m5!3m4!1s0x0:0x64853caa3a841c2b!8m2!3d37.5500361!4d126.940057");
    			attr_dev(a15, "target", "_blank");
    			add_location(a15, file$1, 137, 4, 4132);
    			add_location(p10, file$1, 135, 3, 4110);
    			if (img2.src !== (img2_src_value = "/res/map-sogang.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "서강대학교 약도");
    			add_location(img2, file$1, 144, 3, 4445);
    			if (img3.src !== (img3_src_value = "/res/map-k.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "K관 약도");
    			add_location(img3, file$1, 146, 3, 4500);
    			attr_dev(div33, "class", "p75");
    			add_location(div33, file$1, 134, 2, 4088);
    			attr_dev(div34, "class", "row pad");
    			add_location(div34, file$1, 130, 1, 4014);
    			attr_dev(div35, "class", "contents");
    			add_location(div35, file$1, 9, 0, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div35, anchor);
    			append_dev(div35, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, h1);
    			append_dev(div35, t3);
    			append_dev(div35, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h20);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div35, t7);
    			append_dev(div35, img0);
    			append_dev(div35, t8);
    			append_dev(div35, div8);
    			append_dev(div8, div4);
    			append_dev(div4, h21);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, p0);
    			append_dev(p0, a0);
    			append_dev(p0, t12);
    			append_dev(div7, t13);
    			append_dev(div7, p1);
    			append_dev(div7, t15);
    			append_dev(div7, div6);
    			append_dev(div6, a1);
    			append_dev(a1, div5);
    			append_dev(div35, t17);
    			append_dev(div35, div13);
    			append_dev(div13, div9);
    			append_dev(div9, h22);
    			append_dev(div13, t19);
    			append_dev(div13, div12);
    			append_dev(div12, p2);
    			append_dev(p2, t20);
    			append_dev(p2, a2);
    			append_dev(p2, t22);
    			append_dev(p2, a3);
    			append_dev(p2, t24);
    			append_dev(p2, a4);
    			append_dev(p2, t26);
    			append_dev(div12, t27);
    			append_dev(div12, p3);
    			append_dev(p3, t28);
    			append_dev(p3, a5);
    			append_dev(p3, t30);
    			append_dev(div12, t31);
    			append_dev(div12, div11);
    			append_dev(div11, a6);
    			append_dev(a6, div10);
    			append_dev(div35, t33);
    			append_dev(div35, img1);
    			append_dev(div35, t34);
    			append_dev(div35, div16);
    			append_dev(div16, div14);
    			append_dev(div14, h23);
    			append_dev(div16, t36);
    			append_dev(div16, div15);
    			append_dev(div15, p4);
    			append_dev(div15, t38);
    			append_dev(div15, p5);
    			append_dev(p5, t39);
    			append_dev(p5, a7);
    			append_dev(p5, t41);
    			append_dev(div35, t42);
    			append_dev(div35, div22);
    			append_dev(div22, div17);
    			append_dev(div17, h24);
    			append_dev(div22, t44);
    			append_dev(div22, div21);
    			append_dev(div21, p6);
    			append_dev(p6, a8);
    			append_dev(p6, t46);
    			append_dev(p6, a9);
    			append_dev(p6, t48);
    			append_dev(p6, a10);
    			append_dev(p6, t50);
    			append_dev(div21, t51);
    			append_dev(div21, div20);
    			append_dev(div20, a11);
    			append_dev(a11, div18);
    			append_dev(div20, t53);
    			append_dev(div20, a12);
    			append_dev(a12, div19);
    			append_dev(div35, t55);
    			append_dev(div35, div27);
    			append_dev(div27, div23);
    			append_dev(div23, h25);
    			append_dev(div27, t57);
    			append_dev(div27, div26);
    			append_dev(div26, p7);
    			append_dev(p7, t58);
    			append_dev(p7, a13);
    			append_dev(p7, t60);
    			append_dev(div26, t61);
    			append_dev(div26, p8);
    			append_dev(div26, t63);
    			append_dev(div26, div25);
    			append_dev(div25, a14);
    			append_dev(a14, div24);
    			append_dev(div35, t65);
    			append_dev(div35, div30);
    			append_dev(div30, div28);
    			append_dev(div28, h26);
    			append_dev(div30, t67);
    			append_dev(div30, div29);
    			append_dev(div29, p9);
    			append_dev(div35, t69);
    			append_dev(div35, div31);
    			append_dev(div35, t70);
    			append_dev(div35, div34);
    			append_dev(div34, div32);
    			append_dev(div32, h27);
    			append_dev(div34, t72);
    			append_dev(div34, div33);
    			append_dev(div33, p10);
    			append_dev(p10, t73);
    			append_dev(p10, a15);
    			append_dev(p10, t75);
    			append_dev(div33, t76);
    			append_dev(div33, img2);
    			append_dev(div33, t77);
    			append_dev(div33, img3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div35);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Introduction", slots, []);

    	onMount(() => {
    		document.body.scrollTop = 0;
    		document.documentElement.scrollTop = 0;
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Introduction> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount });
    	return [];
    }

    class Introduction extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Introduction",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.34.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let meta0;
    	let meta1;
    	let meta2;
    	let meta3;
    	let meta4;
    	let link0;
    	let link1;
    	let link2;
    	let t0;
    	let div;
    	let navbar;
    	let t1;
    	let switch_instance;
    	let t2;
    	let footer;
    	let current;
    	navbar = new NavBar({ $$inline: true });
    	var switch_value = /*page*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			meta0 = element("meta");
    			meta1 = element("meta");
    			meta2 = element("meta");
    			meta3 = element("meta");
    			meta4 = element("meta");
    			link0 = element("link");
    			link1 = element("link");
    			link2 = element("link");
    			t0 = space();
    			div = element("div");
    			create_component(navbar.$$.fragment);
    			t1 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    			document.title = "Sogang ICPC Team";
    			attr_dev(meta0, "charset", "UTF-8");
    			add_location(meta0, file, 22, 1, 744);
    			attr_dev(meta1, "name", "theme-color");
    			attr_dev(meta1, "content", "#FFFFFF");
    			add_location(meta1, file, 23, 1, 771);
    			attr_dev(meta2, "name", "viewport");
    			attr_dev(meta2, "content", "width=device-width, user-scalable=no");
    			add_location(meta2, file, 24, 1, 819);
    			attr_dev(meta3, "name", "mobile-web-app-capable");
    			attr_dev(meta3, "content", "yes");
    			add_location(meta3, file, 25, 1, 893);
    			attr_dev(meta4, "name", "apple-mobile-web-app-capable");
    			attr_dev(meta4, "content", "yes");
    			add_location(meta4, file, 26, 1, 948);
    			attr_dev(link0, "rel", "icon");
    			attr_dev(link0, "href", "/res/logo-crimson.svg");
    			add_location(link0, file, 27, 1, 1009);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "type", "text/css");
    			attr_dev(link1, "href", "//fonts.googleapis.com/css?family=Noto+Sans+KR:400,700");
    			add_location(link1, file, 28, 1, 1060);
    			attr_dev(link2, "rel", "stylesheet");
    			attr_dev(link2, "type", "text/css");
    			attr_dev(link2, "href", "//fonts.googleapis.com/icon?family=Material+Icons");
    			add_location(link2, file, 29, 1, 1166);
    			attr_dev(div, "class", "contents_container");
    			add_location(div, file, 31, 0, 1282);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, meta0);
    			append_dev(document.head, meta1);
    			append_dev(document.head, meta2);
    			append_dev(document.head, meta3);
    			append_dev(document.head, meta4);
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			append_dev(document.head, link2);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(navbar, div, null);
    			append_dev(div, t1);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			append_dev(div, t2);
    			mount_component(footer, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*page*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t2);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(meta0);
    			detach_dev(meta1);
    			detach_dev(meta2);
    			detach_dev(meta3);
    			detach_dev(meta4);
    			detach_dev(link0);
    			detach_dev(link1);
    			detach_dev(link2);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(navbar);
    			if (switch_instance) destroy_component(switch_instance);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let page$1;
    	page("/", () => $$invalidate(0, page$1 = Home));
    	page("/introduction", () => $$invalidate(0, page$1 = Introduction));
    	page("/history", () => $$invalidate(0, page$1 = History));
    	page("/spc", () => $$invalidate(0, page$1 = Spc));
    	page("/contact", () => $$invalidate(0, page$1 = Contact));
    	page.start();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		router: page,
    		NavBar,
    		Footer,
    		Home,
    		History,
    		Spc,
    		Contact,
    		Introduction,
    		page: page$1
    	});

    	$$self.$inject_state = $$props => {
    		if ("page" in $$props) $$invalidate(0, page$1 = $$props.page);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page$1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
