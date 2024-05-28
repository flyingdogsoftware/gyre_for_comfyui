
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var gyreapp = (function () {
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function append_styles(target, style_sheet_id, styles) {
        const append_styles_to = get_root_for_style(target);
        if (!append_styles_to.getElementById(style_sheet_id)) {
            const style = element('style');
            style.id = style_sheet_id;
            style.textContent = styles;
            append_stylesheet(append_styles_to, style);
        }
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                /** #7364  target for <template> may be provided as #document-fragment(11) */
                else
                    this.e = element((target.nodeType === 11 ? 'TEMPLATE' : target.nodeName));
                this.t = target.tagName !== 'TEMPLATE' ? target : target.content;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
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
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
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
        else if (callback) {
            callback();
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
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
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
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
            flush_render_callbacks($$.after_update);
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
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
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
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
            if (!is_function(callback)) {
                return noop;
            }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
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

    let layer_image_preview="data:image/jpeg;base64,/9j/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////7gAhQWRvYmUAZAAAAAABAwAQAwIDBgAAAAAAAAAAAAAAAP/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAEHBwcNDA0YEBAYFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8IAEQgAkgCrAwERAAIRAQMRAf/EANsAAAICAwEBAAAAAAAAAAAAAAIDAAEFBgcECAEBAAIDAQAAAAAAAAAAAAAAAAECAwQFBhAAAQQCAQIGAgMBAQAAAAAAAQACAwQRBQYQEiAwIUETBzEUQCIVYDIRAAIBAgQDBQMIBwMMAwAAAAECAxIEABEiBSEyEzFCUiMGQVEzIDDwYYFyghQQccFikkMVQNEHYJGhsaKywtJTY3MkkzQlEgABAwICBAsGBAcAAAAAAAAAARECIRIxIhAw8KIgQEFRYTJCUmJyA3GhgpKywmCBsdLB0fETI5Oz/9oADAMBAQIRAxEAAAD5imLLLIUUUWQhExEKTCEIiFkIWEQoEohCy7Q+9fPivREUQsiYRMCRYRAQSpSqSze5rdL9Dx/fta+s8/f5353rePFlpETZEWQoYEWCCCUNh1HJj6T3eXhexzFJCY8uDNzjg9fUuXuxMIWWUOLICLKNm0dnqXI2d2rIes4y+pz8N3OZQiR1tp+jtcy4HZ8WDJC5XCDyAgB1t03l7PVvL9DHbdMdao7+Hn/q+H7c9N0wZtj3dZe/p4/c18NZzXg9fTOV0LmpRMHggGx6ebtXnNnV96KyU9OG+MvTdOJ0dV9RyMR1dPPYsvQdbZPoaW/Zsendnm6X1NHVufvcs872PDiywehZsuKev+U6HgzU2TXnD5Go9Gg1ZGL+GtMsyYzs6G46e1k8j0d7kbdkodq1s4ubdDU+evJ+i84xAS9ye+8zNr+lda2X1MmPmdl1N0tecXuauCtCcmH02tks0Tcw5HPrdL6OLZrxxK1vnHDkkLkEisdeOv4Le/i7GA18jcOXKY757XysjJ79VpvR1n4I9VNmpysY8l2udzX0ejztIUDAYSxtz7vReNvl0Dh5dW5ezmtfYPJbI8va2Xm5m5cbFtF6GDM6+b2+n53CPT8vC1JpKsYKk1HY+5+Q/JDcj2zHWeTlxfD2rwbOV0801tj12x5nXtr/AH9HAen5/M97CupWOU45VjLqRWWWOtDrn5Ibcdx3jompbavN7qefteC05OmXM9Xn8h9NparkqFZXjKoTSVY5GpMGSZMNsbeG3MyDuO0Zqjp3D236mXHdTByjra3liQqXQnGXSV0BWRgMQYcjkdjLjvDLjvBXXM2qKarK6lYyqFVBSw1VAYGgi5EFIrDsK4rRdx2WUBUqkroXQFQxIwqEHIstMLlZdoqyXFYdoIqAQXSQoCqoVCiJh6EQibIQGYXKpXYVhEgMBhVFFQhCJh6EQtMLBFxCrBLsOVllQqFVSUqkoRMP/9oACAECAAEFAPK/HQLBP8MN7l8MrU7KLSP4GVlV6T5FXpRRotBVrXseJq74yVnzfd72tEM0eKuzb3Nc0oeiCkha9Wta5iP9fLysK5sYoE646ZRXi0x9rlXsuaWyAh72rPcHMyrOuZIJ67oishAE+N72sVq656sUZS+kW5t/1dqrRikH9iJntTtg5ir7LuX+i0KKw14khbILetLU4FEEDwEq3fjiUt90jjY7W4a4NpDvuVmOZ2ujVLZB7Y7AU7Q5td+FG/uUbnMNfY9ya4FWte2RTQPjPgsksYRlxrteP7QGeQyBtktbYtQtUEkVgS02wmtbLzHOHMc9oVWySa72gNfhGVzFW2faLIjkj8BAKsUQ0saVgFSwenygtJaAL5rtqXXTMlDY3fNK0MkLg6YObDckjP8ApuChtse1zmkGR3bjwYXoVPTa8TV3tLSAJIiEIsgRhfsiMwPa98OwjkHzRuQacftmJtmz8ioU5XFsWE4LCx1CAQCkhbIrNB0aexzE4uKczLXN9JGelWt3m0WgQumlDqT3LV6HD2sDQR4AgggggnNVrXdycDGJI8tMBa6WAl/d2Nr0yXxwSyqtQZGsFFFFHwAoFAoFNOEFZqtmbPSfCrFkhpjL2iFrTW1RkEULY+mUPREolZWeuVlArKBQKaU5oereqJd/mzd1TWtYRgLKJRKJRKJ8WUCgUCgVlZWV6IlE5RciV3IlZ6Z8eUCgUCsrKyiVlZRKysrKz5GVlZQKDl3LuXcu5FyJWfMysoFZWVlZWUSs/wAU+R//2gAIAQMAAQUA8r1QXcj/AA3OAQlaU0Aofnz8FFTWmMU1l7kHOCr3HNUUzXrKGT5v4XqVIHKxTKcCF+UfRMkLFXutcvU+YVFXc9fD2J0QLXlwU0AILCCGlf8AlByr3XMUczXr8rKPj7e5RwhqjlappMqI9ytV+6P1T4QU2o16mo9qNJykiLFFI5ir3g5NwUPFHCXL4wERlEuCMpChmwWOBE1chOjUDi10ze5Pb2pzWuE1IgDOa91zTDM1/haPVsnaO7tXd3JpTmd6ZWke2Vj4iJi4y1mtDmEPaPWaEBTtKILkY2FTUvWv3tf4RJkAgrCagzCa84kjEhngDFh5GASThepUkIcnVsqSEtTAQhE3PgKymuTXoOQKD0HlCMuD2EAwEL4imRgI1u5MgDFYc0rHk5QemOTQEHFMByG+sknamMTmtCZM0C3fLkfXy8pr8JsmVEV8qjlQb3l8oAlexilm70RlHzWv7VFKCg1BydI4iSzhF2VjoPNIQJCislCcFS2S7+FjrjoP+h//2gAIAQEAAQUAQAQHUlHoPFnwZWQvRenTCAWEUeo6NaXF+vvsYfTyffCA6lHqFx/ie03T9NxbV6mJ0K5DwejsVs9Vf1tjPXPg9wgsIlFEoFVqtizPxH6avyxxcR27Ne6PBLPQsWz1evvxcj4BdoDwDp7gdCiUSvyuJ8B3PIDxfjup40hag/XH2rxupqrnIPrvcV5qb2KDW2rMzWyQSR2TE7knA9dtBttNsdVZ6BBe+EUSiVUp2rtniH1tq6cFbeautr9lVNXV8ZnsxRc9p19kxvwgUtxdqN1Gw3V3Q3Whkep4y7dDdaHZae3sdVS2Fbkv1zfoA5CCwvdEpxXEOA7fk02q+v8AT6PX2dVHc3NCDZ1W/wC/KzW8e3+1/bbar7B2y4/Hr5rFBkS0FrbVpOObuXSs196LTbu5co7PVbz68DK7oVyjgGt263Gi2ensr3KcV9dcdrb/AJJWdRaavJbuuuPl1PIaun18mhO6qS8m2PF9NyyePda3f8TbreW7m8+3VbQhgmjZsNJsoxf2Gri/V1W3Gvmv1J5Yq7dbbg5D9da68L3Godm7Y1W1Nh7kolaHe7PRbjjW54R9ojk1exr9nJJaoDWcohm2e50uvZfhkMULeN1OQbrln15W1Emiqcg294soMuRtZ81HYbuioue0LVLXfYWzpVtPsaWz1ushuRn7h+/9IJznPuSspoUWWu4t9s63cVN/ot3xYzyzWJ6e8dspRLCxlD9CvWijmvXeWbK/V0m4+vt3Uml4tyWkI2xua3Uzb69pNXa0+xfo9LV4/wA/+29tyKm5qIWPUlNTAmNTAuD/AGJvOKOi4zo+VRNm1ttkFGKlKNzPFa124kdb1W8iZJuJNlSr6sVmWt9T4lpzoN5d2N7lHNeJ8Apcn5NveS7V4CcE4L3BTUxMwmppWs2d/WXtXy/hv2E7lfDtpo9vp5pnPdbo/rVdnTmrULP7UnLN9HFouI/XOv3FXffZuu1FBxTinYTinFe4TUwphTXJrkCgQuC/btzT1NjxaGTTxtc+9qZ6cT9w3Z3aj7XHeCabnP2PyPmNwu9HOTnpzk5yJWfUBNTU0prk1ya5ByDlxbmG/wCLbKre+sOa1qvDQwbD7F43w6G/sLt+45yc4BOenPTnIuRK9wEAggUCmuTXIOQcu5BwXcEXJzk56c9OenORciemfUBYQQQKBQcg9B6EiD13ovTnpz056LkSiemVlDqOgK7kXr5EJEJF8qL056c9Fyyis9fbHXHQlFyL13oSISL5V3lFyLiiVnw+3gKcnI9Agh0PQ+L2/9oACAECAgY/ANVXRUpxPpKxVvKpVCnEnahg/mYwKY7dBXApr6jy/haJBmTd+oppzIPHDboGauroVMyvLuwKrb3RISSgko5k8JVco6HNpy5ZbdA0k+LsaKlOG6qyDen8/wC2Q0VlLn/uvItVr4l3ZUtuu9Ne9L/n2et1xnGRTNdLb2lGjt7R1rt7S5FGkjoPCsd/9CqFOE3Wl3TPhuiWoioO9q7xcu4InKJJcq90ZVz7dIyjvpeKjTT5f6j0MuVdugaSLwXQuxU6SuZBFjllzCX7o6rmj3esUjWPejEvVf8AUbXlUMR1pcMow6S95/k2810i5WWP5bvBbEeKHMZkGQtkgtMy9rtCximZe0NJFWRjapai/MVWJlVI7o6srDq0U28Q9NFr5eHSijSwGUfkHVKjyQeKOX+r1eztMk6WQ7N3a+0XGPmYtaSovaESSraJGOPYFVckZfbu6qpRHTboHx8I46lqIWqrJvF0skI/Dd8wyK6p3SuSMfNGZW+Xhrd+gnqeq7x6vd34lqYavvDw6wyxr7B3950DqJHrWi+p6nV26wienGCea77R1S6Xi17cphcgi2+4RcPqKpc/xCLJ0jt4TKjcQoNJB473V+kejfF/IeWaW3Qc343/AP/aAAgBAwIGPwDW04niY8WxUrgZV4hQaOG8Pj9RXS8RpYnRrebQvOVTNwKjoZqxKKU1NDMVoU0XJiV0UKjIMqDoo2o6DKVK10MNpbTgPFRkoMuBTgsNpqUEoyfmIi4Dcg8ceBQqYe4f09vlPFwmXgUG5B1HQoPoroopgpQdq61pFsdNViUtHVBERddQccZcR1KKcn2jIPxFxkKr+45uJ5aIUxK8SroaOH44/9oACAEBAQY/AP7LlkPf2D9fzeSio+4ccVvbSqnjZGA/1fNfT3fNBoV6VoDk904NP6l8bfq/iwBBHXcEAPcScZG9/wB1f1Yyy4+7DT2oFrd5E1AaHJ8Q9n31/FVgwXkRjcdh7VYe9W7D8x9n7PmEgt4nmmkOSRICzE/UB24S93Xp9UFHttud4zHNmc6WkEi9lL1jT95tWLuee1g25NujErWivWRCxWmkxhoo2yarovIktCdWihscB/m4ezPHH29mAe0Z/bhre4iE1uTwDjiv29xv1Ye62+q6shxZcvNQfWBzD61x+rt+V9n7Pli4Cm12pWHXv2UNklQVmijLK01GeqjSvfZMfn9th/NdEL+aadc/zELDJwAU7O3NV5UpwNw2aaQ2kqPHPt+QCW6y5x5QsA8lAD8UaKap+Zeny7jtFyl5tm8lre0O4bex6zW9sMlL1JEpcJ5ThxG8nL5NFCLDb7nFb7nAqqt20ElvDMqIABKWEaB3YaWWCKjvs/PgVDg3FSCCCDxBUjNSD7GB1YENtC80pBKxoKmIHEnIZ+zAOWTociGAOR9xVv7sSihTHMpEkWWQ4+0HtX8P+7hp7YC0vuJ6gGhyfGvsq8a/jqwbe+hMT9qN2qw96sOB+T9n7Pkpa2kL3FxKaY4YlLuze4AceGF3f1LIJjEQ521VYqpU55TEDW3viX8dVWHvbqFdusmi/wDzZ7VTVDb5eYKnpGUr/wAjuaaEaitTezSuBelZbNaYyzKDUvmRiMcRkr0r+Be9dxh2LLqiRUAUcQWJ40kK3tz1N/Dia7lhZNwtwjQSKhV5oGbW8y5DipLMoCLTqq6ndJDHPsOWZIy45/WMMkMsgEnElWKEgDLsByzw6QiRpGLTiZwzK6hFzRXYn4agy8Q33PEX3S2luXjEVsksUipIJnU0o6lXajJWpfLw6IuTCnb7mJtIEoJYqsvHNVala1qVlWSnu6qcC13CExSsKkParj3ow4N9eWGtruFZoW7Yz7D7wRkQfrGGuttqurQcWjy81PsHOPu/w97HHh9X6fs/Z8iqMi129PjXsmWWQHEIhKmRuHd0+Nlxbzen1E0vCO7lmUSG6BYFlJY0x0ZEhI/AlSYudr3XdGspmfqtQgmSRmckOy5q0ZyX4flU81NPOdru7L89ttwco7iKVaJChYq9ZeMAFYqHDS6F/eoxLZW0cVtcIjQw7fdLUddLmTqL0nElI0kinxt3sSypG+XHoSZl42p5hmAocd7RTTiWG3zLdOsmTNUZmHZkGaORTyuvTkXm/ewLgRH8lKSqSXDaRK2ZPFAI1C6qFZvM6WmpHwWUMqqKgrCRjpIR2zoC01e8/ufvYltbHzob/wApGVRU0kdRjaIyUvmrP4fvri76m2G/s7uLoSm+zXNXDySo4jiehVkyr+Iiu2nVpxc3U8ivtDWwMLVrLPEqSFStAK1p1a9SxtJ8Pp9NH6eILa+Md7ts+UkbKAcgeAZGADIRx9uLm/2i8iuLOECQ2ztTKi9h4nS1J9unB/08P78PcW//AKm4HiZlGhz7eooPt8fN4qsG3v4TG3Eo44o496t2Ef7Xi/R9n6RaT0skMEtyImzycwrUFNILZd58l5Vwm2mR7a3EZMUUao4jcZhKXyENxH3lZdVNNOtVx1o5vzCgdMuQ3TnoypMmbLqpGj/i5sTTrctt9301jJLkPrzrTPIdZKWYUV6f+18R3M+VxthQTSXNogMKhXIYSmQs/UDsEpXqSaav38Ty2TBXWvoWskuYIrJY1yvXU2nxu3K2M4rTqWEj03MMtJhcK3Ty6bEM51U6Vq8FOLR5HiuLK6QtA8LF4TkBUp4ANTpbL4dTLhbG1jSVWzolugGRTlqIU5qeB9mnVS6tHpwJCjRkr/7MTMr28rUAEkrkitqXOmh+/H0/LxG1heRygsTCjGhGfIaVUkkZN3z4atOLYFZOtD1JrhYHkCtJJxQ5rlE4BL1eY+lvCmKJikpguM1zQMVR2GZFTBMytOddMenkZcSWUimK3hkLPcNVEiO7dj9UqEJ7eGjw6sLOuYUABiDmpzHDs94GDbbtaiYIM4CopKM3BjUDnqHNiF/SygOsTvc208jlnYAFFizDaufmdMHaNwtWJkkETwOhWRH5eCkVI6Z/hxc2quJFglkiEg7GCMVq+3H2fptd322XpXto9cTkAj2hlIPddSVYeHEFrEyem/VmVJ2kyMtpcnx2TkkREHV+UP3U6lNeLrarmSRTYyCNkFMeTgLm3TzOVXh6i91v3MJPZ3KvHbMORygzXidBKyFubzE7neXAW7iUiYgyRysDGAeJLKyUl2GksxrarmbC7htM0VrMzM89lnocLlpINBiccckR5NS8sWFiuGILdIjb1ZWtXiY1NXC4Z2Y6V1nqRtDWr+bJiO53K4LWFvAQu3hqG5glMdCRaMtXT6qeZ4eVjuO1zW22223qEHXnokknGbds8oGQXJBQFZn0dN/i4NltcZvH6lKOPLUuhGXxulxXw6X/AA4e6nMsF1C7pLLBSjEqaStIrgdSwNen/wCTEhsBJLGo6rQqscaotJOSysy+1tKLHFU33tcdu4kuXI6txZxRySoqEAnMRDPmJB5Ven7uHiWFHCuGED1uKjkHKJKcyrJHH36oaE6UWILS3ay3GxUFzDGHd42cnj1Cy0FiVd6mkanuQ4G4wwy2sSqxliuloZUQ/Ez+G0ZXXUkj6cGe2l6SKpkllYhI0ReJZm4ChRx1YmsfSKxbhvHSNvdeqGUhI14gpZqe1uLL+Zyppq6ayK9WM/aeJx9Pd8gMpKsCCCO3MdhxDsX+I0TXcMa9Kw9TxqXvrfwifI1XUKsP/OurW1eLO+guUv8AZ5j1dp3eBme1lU8KldGIRxqHTLK64a5iQy3RzbpZKEZCSXOlhT28R/y4jiWQQTwJIDFkWLnMnLUdKgHLhppxbwWN1LD0z1LkUZhBwGZYrp6lJOoN97nXDW5Ec1zcwyS2xfqQAGM0ABs4xJUp1SZUfy61VnqW2iurmKxlDRNtxlcpKkxp0qoXoqprZFWKNEo1R82Lb07sEItrjVHJKHLSiEZrHkkEaMkj6WzTw61evG2Mt8d33u7WW4vIOJaKMKcpC82sLo79LN3FxaqUE6MAY4oq2mGa11NbNRMvNzgUr49WpLm7dLSWPONJiskgYxqCEQZoqurK2peo9Nf4Z7ixWEXyp1IHd2jYaGpKNIW5MjI2rU+rFwtxGpCoyblIrGRJGkyUNnGHVMw+bUa6/wCBbPevU+6vaelYldNvqUtf3qPxaK3OUU0iN2ebGkMatU/ex/QtqiOzek4WJi2yORnkn459S7lYlp3LaqD5aadOivH09n6Pp7vlSwRCO/2S8I/qOy3YrtZge1sj8OXIaJk1I1PNhd5/w+llLwjPcvT8kiruFsGYBmjJ/wDsW656ZFOnR1e9gR3FNvOjhyxjCssmRXJ+HK2kMmn/AKmp8LbXVg63kuU1pOHEcOvRGwiyTynEbMlBSqnp6cTX25O97fDyzGGWN2gZQi1PIrsA2XlrF/L55O5i3kaSNwjO4UgTJG5ACtqQszx5MyKj01qveqx1YbdnmAKzXi0KZnjXpoahS9XeoHi5tNWLOIv1Zb8MJXRVYpTk7KroFV16dNVTO3m/dxJbW9nAalIjFzFnFIGbMux/mKuefPqSnpNzYFpZWq329XUpM18xWSBWLFiscSOUR0KiN6l5P3tWIdr2WG3m3OQNCIre3twkZKspypK6Ke2Ly/w4udpEFp6h9UOV6loI0NjaumWRuaAoklVhn0U5eWSXvvLuu93b3l7LwrflRAcwkaDJY417qIKfkfT3fLhv9uuJLS9tmDwXETFHRveCMJaesBHsvqphRF6gjCxWl03AKLoU+RL7pkHS5uXRj8vfQdNq/LEis6zQPwzhcVrUc3bNdNGqvqacSrFt3RsWboxmWGOSSgnPoCUKGYsw1sVRE5vLXEtvtsMklwIVqd6GIdoD1I41ORqd34tR9xe9iX+lRmNo2pu4brW0alyzFnPDShyXhp+7g5Si3luGZYZLZY36aFUFZQhgx4dwq8nNz4/pe0rF+eRo0uJlKrHDEyjOVISFV2ZaYz0a6Gr1/ExuG+bz6hkttns3c3V3KGiiDPxy6sqt1JGB+F8XkTmZWxN6e/w8ilsNvkBjvt9ny/qN4O1qSMvy0DHjRFS7d7vI3yDj6e75lNi9QwNvXpfKmO3YgXNpn/MtJTnTlwbpOen3fL5sXG9+nt2l3T01dkB7q3kMcttK3KLuIny5amokqpSRHaRZEZkxPapElvZ2RC1W0skoaRMwQ7EgNWyDlala/wCXjcotwuUjZpDdRyW5V0kkgBqjYZtM3TkK8zdBGTmqerETWl+5voenJSoMfWkzCmBpFk0SnVNQ1Hl01SSs8eIrj1ZCE3F41Nr6bj6Zv5MsxXPLnIbSB8qs6+pzUJowr7hKsNhASbLa7cUW8AY91RzOcyXlcs/4fl/T3fNf1DZrowSsKJ4iA0U0efGOaM6ZEPub8OqnEJt5bb0NvuRhvLXKixmL9skUoGUXHmjkp06K2prwzbnvWzQ2hiMJuTukLI0SoCtEaZvmaBwyZmarmwbf0Ww3P1C8Ihn9QuhS2twAFpsrZhk0mWQa4kXu6E1aZb2+nkurudi81xMxeR2PazM2ZJPzH2fs/s32fs/yZ//Z";

    let magnifier_preview="data:image/jpeg;base64,/9j/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////7gAhQWRvYmUAZEAAAAABAwAQAwIDBgAAAAAAAAAAAAAAAP/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQoJCg0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8IAEQgAYwBkAwERAAIRAQMRAf/EANwAAAICAwEAAAAAAAAAAAAAAAYHBQgCBAkDAQABBQEBAAAAAAAAAAAAAAAFAAECAwQGBxAAAAUEAQIFAwMFAAAAAAAAAQIDBAUAEQYHEhMIECEUFRYgMSIyJRdCIyRFGBEAAgEDAwICBQcIBggHAAAAAQIDEQQFABIGIRMxFEEiMhUHUWFxQlIjFoGR0WKCMzQXobFywqMkEPCSokSENhjBQ1NjZEUIEgABAwIEAgYKAgIDAAAAAAABABECITFBURIDEGFxgaEiMhMgMPCRscHRQlIE4fFignLCI//aAAwDAQECEQMRAAAA4OM2CWaTCSKktdP6M/sl7JLit4GTydF+xawhbl9WTvdBrrBMUJp1IQkhaMmVVoi6tCvvxyeiocpd6JC8ZEU6pB2l0i9pBMowbSHIzlIzi5RHtMLAC9yN2Yi1M7WcTspmZMxFYtXgO1zMa70y8T3HrFcZp27w9aL8hjZSx5p/yktNmNyztQ1VTkx70a0FFCQzXa9xZoXIia7WUN5nbhPFawlEu0MX7ISYjVXChqyD5gFFyjZX8CGEvtyITVjkpM2Ge65jH2ur2Eko8zOwGUK5/SCcv0MQE63HLzxgTjFQo1r4C0aVuYG3LxaOnObRd/Pp5edThqtnuFOV7wz4L1Ognf8AkL8N8PHC+wCdnNXRxFAjYITe8dpzfo0K3Hwc2jyOej5TAE4jADv5wqhY1Of9LUx7za1gnoHjTqVhMAqCAgveOi6dAsrCUE6Q1kgvoOESDPdDjvYXdp5yupjmLfD9xwr9CzSsCXNpAgHtCPK0hszw1lNfZLyT3u4b3c2tDkBAFXI5xGTQ26CTOyGUma47FmEpRSjPEpbye9IHqIS+LfwdAuNwLvDeI5QkBlXqtbBnXXiyhEs+unxZbaX/2gAIAQIAAQUAoPoHyov5Bxq1CUB8PTE59Av1hVvBUoiCJhMBa4/j4EE1qtVqAKv4CF6AtgCuQcW7jmNWr7UAVxohaEtcRo5vMC8adGFKvd0+iQhTHA16L510+VJFEaIjekW4mE6dhUN5lS4AYaOQDl6bboty2IYBsS9mYlUFWOFQGJCrFZpBddEyh1GgIAehGgGvbkrMwECGUAoHT5hcqZW86dEvuvJVORUpiVs3RkVCiZ27KkATiIjLtF5ZDkb1MI/ReJGdFIob1HEwBxWdgSgIchlZYyR2Ui2dkdJgapRgJyDErAfHGp0Uv6mLgVlnLYhjFEyAogRdRBQBMoAACJUnJn0W4amjp0HBVLDQpFuUvAthuBAROksRwmskJTAFwaPxKCFmxWRSnO85hRmpDVdREIkF1jeDl6o3FKSFQgCR4Uzc6Q8L0VyZKm5zCK9jFAhjCCV6AgFHwAhpFNu2Mk3ZDwMVYDB6dM1KszGBo1WSU/IxSkAv0Xot7yf3Rov6Wd+R6PypP6v/2gAIAQMAAQUA+r7VfwDw9Upw9Uf6L2q/gNXq9NzEA7xIpDjV/PwNbwvV6H7UFANCYaGrebpp0vC9CXkFcqOPkBqAaITyE/IWaHXP8cX9Sc5yJ8QsYBLRT8BXTsBjWpU34gakUQAp1RUEoUiqZJT1LzrvBsqSwiewisAkpq+BMz5AUTOR4lbJlTIo4MuYoUBb0Ytq9apZ9wA4FERKbgPmcTxxFREgESKQpzOyuFVG7ZS0dDquTDhLgCuGvth+iT0E8yUaLi1FVMSpFHkICk1EaMUqgM4/lToHDczeQOWscmCgom8QEuwXxFl7DwnI0jGPYODAUUwcA7SM3IqmIFSMIgqqZII+VbuyyMGZuLcwlEr1UAWWFdW4WOU0gm9ZLRzhouUxFOClP4kLqpndGfDYjICnpJ8ohSKiKp8odMEEbeDWKbumYQZSqrIrRipHpFATc2oY1F9T9p0Qbcin5AmJlhKNxHxFUuNOHsgm6kpxPqFVaGKIOFCCylionlZlk7TN0ynMoYwAFW8fLjjf6XtK/rk7XJam/CnFrhQfR//aAAgBAQABBQBwu5ByRy4uRZ0Y2LYBluUmVjtY4uH8l68aKudtYsg5LmmoJsD63LPt3BpyFOq8dnOXIpcGfuj72x0NnbZsq6Va47jGuoucyrNNiFYYnGN6Ri0E01o0E2DyDj3NL4yuxXgdoRs2tsXXTjE3YEAK6f7WsUVHkC1i9a4tHQK+czRWJy0gzpNkHB/HASIcR4gC7W1SUY1dlxHMlMcdZvhT7E5fj+0r6baSuU5HOG2LmMeoq3WGCSyuFTYcDpMrkyGKFHH3LQS07aktjWuk/bNivhzNXWkihsvWvwWS9XsmTJrfTMFHMYaNNFuo9xgORPMOndha1aFjGUYKhc7ghb46/ZcB19pJt7HtLOX+wJZWLTRDEZ4MC258Oyv+XO6fIpSTPFuW8jJI5lERM00hEHEd275gyx+Qz/RkjrnLdv4gePx/V3bbEwUDvTZE1tiakSotiyJFFRzlsBW/zeW9Z3etJePz2DwDIs0dYipJYtKYc12W82ppNHWOx8oxjQzaR1/LaPwxuHcrM7Rz6bncayBM62MSTk8rruaSS1jsjX2icm6aP8M97OAZbiuEY9gb7PcKdQMJjB8Xl8yjprRuj1J5bRfdBqDUZ8y2ASbxjbWW7xwipjbGXORa7LkE3j3ZcU7adwk4lkc/ya/OXOPpT+su3bbGRQcBEv8AB9rtM3Z5zpPGs2x57C4trt/M5VJbXd7I1Vimse5PEtxt9s6TZLOZMx0VH71QtamYJ5ntT3UffsHzDHYtrtLGHurMx1/mMdJwOOZK9ZpbC0JEyZUVch2xme8Jd3GtNNwOL5rPOdgTkSXLorG86b78VQxJ7lZW+ucM8vbY/FoiZWxSHhYnEpmDzXtRyHBdlYXsdiMsLan8fiOcSG2UUYhvh81l2NZTjWYRWqJzJ97P4wI9sbVcdKyTiUef62VXj9c5KxmUMhZzmTOIvDJXQ7GUeS20d+aoUYdyuJLKqd0WsFsZg+4zH9d7J2JP9wPcbNpTmFawSlZV5LObVx/bc+9u+V6H6XwDNuh8Ix7pe49sPqP+Vu4P4p7iw/j71DXq89nW90W6HMfT1/j1/Z9v/9oACAECAgY/APSBz414a2qn9V3bqtD6PeFfUNx0y8Q7fbEcW4niwvw14YrzPtdlqxF1TixuOB4aY3XPgYmxWmmh0CzE3H1VLp7FNY5LVDxBahQi4yW5yK8vbqceSYeh5eGp+10SCC8jW1O3vDqCcqlEHJp73Tbkdf8AkC3vC87aDE3D/FGIpqNSmjIGRuUWITkpnUYfq752jGWokPUdRBpcCxxWhsPFzZnyvXJSntgitQbvauRpb6rTdkRsz1Gcnr9g/Eck06rRAOjukVaw9roaoOORbqK1bVxcYjpHAssVIyxPwToygYmADUzz9rLURdUK78mOSMRFmT5KcZxv2ZobmwT3bNfrzC07oaXCyYcBuQOnZDOBRy9TKP3ahQFxpZ3QIsQ4TSTe7kc1pnbPH3IzlJwbclPcAYmn1XJa2YnEe1UQLfBHd3aRFAMzn0ZZ34iWjU/jhGsyTSLirDNrKG7FquGFdLFjE5kWKuzDrB+i738cK2+PTgENJarkcuSadkBEUCqESMeO8NEoTDB64Yc7VbxZLbiXcancMSXu1bo9S7yeKYELSWa+Ljs7E0inF/R238y8snvi2HTVrqPWj7Y8Df5f3nyWK+7qZG/X6X//2gAIAQMCBj8A9XoemSZ/VDXZd0uM/Rp6sTjWBty5H5HHi44jjqlbgIDxGy8hu8zstNdMrE8rqvB1rFjwj0cNc6D4rlwE40IK8xzra/JSgJ64xJAOB5xGATGyYWT4LRPwy7Oaa4NiodC8zctgM05t6Gv/ABZRjGJiIxAY1ricKHrPDNFsfc3zVDp5M/u5ckNqblrfwhRyLKsSwVQhEApwF/7QcGg9ivM1B7NydS2510ExdmBbEPUjIm4QnYkX+qB3oNGMW7t5H8jz+C7q1ToFoB/vnkiRJpDA/UfFNKxscD0HFYIa2TiQW3twbugk9Zp2BMox347kf2JzeOo6o+UB4RVxKJN27z0LBaH/AKRGnqTwDjE/ihJ3daVGcZNpx+AR2t8APn4er8Scwte2dUTbP+elUXiKM5Hgf1t+HnfuSEtJmXMY6AYaNwHTtnbLz3IsTN9LPaW1uDvwLHJ7sgY2Kc0NnzGRzC17VzhgejI8l5cYMQ9OhQ23oKqzlaSdcX93QhMimOZzLZ8lD9f9QicpAGUvxGEP+R+7K2fHdENyQMJAfrbkiYbUYxruyhOOkznEuBq70o2W/sTBLaamhk4fWLsDcOXzTEOD7iPkfayePuy4PEETGINT059F1KO5F3DRIs6AjdGRdz2pwaqvH9HzN2O9sS1T0ERDSI7s4mo0gyaGvwnE3H7O5DSIy0ECJEhHu+HUKEjFqO6iM3fsK7qaQQJBTx1asXiGl20PNatsFuabD0Zt5fhhd/xNn+VNVluX+35qL879HJYIW+fXg2XN1h1quj/bX/1QbT/q/a/pf//aAAgBAQEGPwC4CzyKO65oGI8WJOus0n+236dUWeUk+ADN+nTNYwz+XhG+4uncxwxJ9qSRyFQfOxA0Vz/OJc9fxgF8bx5GuxX0qbmRo4K/2WbSQ4ngF9kFZgomymW7Xj0qVghoP9rU9pcfC+0Y20rxSSWuYuCCUJUlXKOpHToQKaSG9x3IeJyv0a5ikiyMC/So7ElPoB1Je8A5TbcuhjTuSWVpK6Xsa/LJZyhJh85CkfPqS2uDcRFSQysWGi5uJan9dv068iL6bywNe1valfz6/iH/AIitdxr+7p+emrgDw7r/ANZ0sMKF3c0AGrTP89D3mUv4hPguGQOEublD7M07kHsQEj2iCzfUU9SEt7maPCcWhb/I4GyUwWEVKU2xAlpnFPbkLN+tpWkia8kHi0xov5EX/wASdUgt4oQBTakajp+QasfuUAeNumwdRX09NN37GFy3i6rsb8601Hf4K/msb23YSW53mN0ceBjmShUj/U6j478Z7KSWtIoec28IOQtiega8iWguox6WH3gHUF/Z1DPazw5TCZGJbrD5mzcS2t1bv7MsUg6MD+cHoQCCNfP6dV/+T/c1MF6l5XoP2jqPnOdtIr/NZBnh4ZgbgVSedKb7mdagmCAkVH12olabiMhyLL5a4zGQyMcd2ovV2TXE5Ud0OASBGhG1AvQrSgUCmirpsaL1WjpTbTpQD0U11Gj0r01hmZP3ls5r+1qoFVPp0en6NIt3CJFhYNG3pWhqRXodp9I/qPXU/COfW5/AvIpmurVkjNMXLcEhb2yU9RFXpLGPaUfbUauLSdVeEEPb3EZ3RyxOA0ckbDoyupDA+kHVKdfM1/3NSclw8fu7jcFw83Msc53+6dqmaS4R/B7aRAXjb9n6brKmE2/H8YqWmDxv1YLGAlbeH6W6u59LFjqG5gbtXELBo2XpSngPo03J8PEDf2IC8gxye0p/9VR8h1QivyaJp6NcTbbTv2Dt/v6PSmmYjbTx+TUvNeXVsOM2nWzif1Xu5B1CqD4jR7dulrDYhlwluoA7a/Yr8j06/P11k+D5JO9y/gSCfj8zfvJ8O77ZITUkk2srCnyI9PBde4u2PPd3f2ajw2eGuW4/CZSTN23NMjHxni/N7S3eztbzFUW+ylosMxL7IJO3Cn2VZk8Np1iLHOhcHd52EZHE5xpe7aTRyEIIruMAvblSKBwCOvrCnrA2t5A1vcxqrGNqGqsKq6sCVZWHUMpIPoOrXMW0fmYB93kse3sTwN0dCPlp4asPiFw6t9wzPr3I3QVa0mPtwy09naenXTDb9U/1a+HY2U72E3n8r6eopTx1J8UvieWwvBMf95j7KX1J8lKvVVRT12nW22txjeOY/wC5wuGi6RxRL0UkDxJGt8pp6dcdz8JKYy9uVhyaV2o1re1t7pT8wDlvppr3BWb3j717Xeof3dab/wCzTr9Gvhzx3IZOLLx4yDJXcN/Bbx2qzrd3YjRhHGFXaq24VK1O309dWUPIr+6XE2UYgM1uqyTxwRszJDFvKqCzGgJPp0OO2cN3yfgbvCuLspHD5DHTXABkix90VG4q529txsc1FAfW1HyDB38We43LKIVy9uNrW8x6i3voCS9tN6Nr9G+ozavOGctiN7wHlwEGUtmG7yszdFuYwfClfWGvd4XzvHcxG9zx3Lx+tHLC67gA3hUA6+GTGM0PGlAAFSWLeH0mun+MXxzU4riVh9/hOMP0uMhIOqBlPWh+TXcmRcLxLFfc8e45D6kMEK9FJUdC1NMtvHuI+udMWJPyDVjPTqkrx1+ZgGH9R1/M7tp5n+W/vHvbfr+5+33K/a7nWvy6+HUfIsbd4e6teH2y4jHfcz2rSpkrpgbWRAiNaSbiUdS58ep9GUu7AW0E4mnnvcfLVJl9ZnkCRBaEIaCnT6NNkk4/YZG7jQxJj8khKwyh/WaNlptaoIqB9FNXlxw2ODH8l5M9xPd4hI1NhJbsu97W8hdNk8JoFYMvUnetG66j4tn85F8CviAt4cdPxXPh5MNdX6dHhxuSZqxMSKrBcmpqBG7DVrwvmGWtuQ2uNCvhMhDG8dzaV8FIkAYD5AfRrj+cyll76XhFiY8dj2UFZGXqrFfAnp01K11x2+gwmPJjxGMhjJhhjXoDRelSPTp/NYu7i/VaNhT+jXbWymLMaAbD+jRkaxlUUrUqdZrPfFf4TW3xUxGbxE2JxeJuxATZ3THuNIiXUcse2dB2pHA3ovWM16a726Pu/wAt+57m3P8Aw38V5bdu7m3s/d7t26nWtdf/AJ+y2f5Bjs5AmMv7TFpi7o3SY+CeZb2C0lLKHidS8h7Z6D6vgdfi7ztxhsllrGKH31jWPfltSFLC9C+MZYEVHrinj6NWEXPeN22Mt8RjI8djsPhpbknPXI3yjKzXa+1NKKrtHVSBuUDRyXCLnK2t5DJL7uNqpuZoYXJZYnYKVZglK1HXx1nuZfGTMY/D4a+g35DGZi5VLi7a4bc891XcQST6oUV+gaxPw1tOR8p5jxyBvKYzleVbuRY+BBRIYVnZrl4SR0DMdv1RTW/jlzJc4vNovuzkuJdJNqy17bhJdqsehqjFd3gprp7nJZdsrxyecw2vJbaE+XLnwhuEkUSW0w9McoB+yWHXTG6uklr47oxpXu1idQep2AaKyrEDt6ig1xzCYqNXlYvJ2kHVpbh1iiH5dp/Pr8G7v8n7s/Cuz6u7yHkvDw9vrrmHwzuI71uUX5XNcWin2yUnx4adbNSancYpXXfWrblXcdtBPgcc2OmbC3KzGC+s/MM1pKxO3fuUhBISCP1hq9wvJcN7jv8AJIVuJYR3MexI9aRZaCS2k2+qp+r6G0uF4xxay/DVqoFzymyTuy45mT/LRXLldskzKamceo1aEbhrBcmk5ZPlclyFobi5glVxNF3IC8op3GIVW6BmA3daU8NWPFrPIWkWSyVykUGVyNwltbQR7Swe4mchUQH1mb5B0BOvhlyTg/KrPFYvieHSOS/ucik1hlLeVe3LbNbOGW8jlljJVB7PqlSpJOlwmatrTjXO5rYWt7hZUFxi8xE5FUja56TrStLWf7xT+6kPTVxffDmIWmQeSVZPh3NMZHneLrL7nnkoXZa1NpMRMnghkA1NDIjwzwO0c8EilJI5ENGR0YAqwPQgio01ZdigEs5PQAdST8wGrrl2QMY47waJszcSXDBY2NrRLCHcxA3STlDT5A3ya99+9rXzHvPv9/zMVd1K1ru8a65TY8jxGTzfxlu7u0b4Ycj8zA9vjIoZBJdrOWJBpH12oK9ynj61LT4qcWtHu+G5+/lx+btZKKkWUMYlv8bN22basqt3oT9k9OsZ1a5DiyJJjMmpUzMAZkYe3DNT2XXwI9PiOhGhY3sKZHFujRHH3Kh1jjkoJBEHDKNwFCGBU/IPHV1yj4WxrcshE+X4XeUDqiHuObSrqixhiPuWYVJ2oxPTWAwuK4xZ4nK4DHSxX1gzw2ilYSvcknDpG0ew0URmpFT4CuuIcEF3cmPAWSPcxyvJQMPUSNY36IqMXps6Hx66s+JZHA5bL5e5s766yeSguJLdcTFboxiv4UhKtMqF07qN4e0PTQfD3nufg5PJh44Gt8xin94S2amL14pnOwZBrYRDfHuFxGprG7UOsdeZnN28mdvYYhh/iNahmtsgpT1YMjUCSTZ7AuHVZk9mVZF9bX8tcdEbrmEzpFyKO3Im8uJKGK1jMRYPJLuBO2tFIXxJpbfD+F0kz9/It/zSdCGpdbSIrQEVqLdSQetC5b5tVoP4rwp+pq9x9tnFxlnibgLxHlOQlNrjo4YFDXssEyJGbghwUTedzg0qFq2sx8POX4ubJcW5NlpvflvcVge6DWtrJBkrNXaU25JcSQDcSpqD6rEatMxYWx5h8OOU3jjHZxmZLHJW8Sgm1mjUN5W+g3VJrUeKh4ya+8OKZASTxoHv8Dc7Uv7Tp17kQPrqD4SJVT8x6aEkUpjcfXB1BdZCaXjPLoQiWnKMcRHJKiUrFOQQXUgbQjHrU+t6NXY55imzuWy2Nnh4Nn8XVra3ui6MWuJN4MUpTqY5FLL6AQxOsNyXhuQvbPkNjKs9v7tnTziROWWSExurCbuRFwVCNUH2a0Gud3F9wuODlOUxbHhM2Ta6iGKWRx3L9p5aLukjYTI4C9UKFAKjWaxHDbkZfPcpEMGXzyIHDMrPuRYgnbmmeTbIJUUbW9jxNIM9yy58/wDEcxy+4cRKwkbCrcM0kk87GpN07OWVSfu6lj94aLNd3MjSSSsWZmNTU6/5n+5rh8kufss3hL9768jxcyxI8c5ZpEmj2bkhUtMwhEhPb6Ek9NZK9tri0khizCLbRWUvet7ZZbC2l8tGwCr90aiigAEkasbDI2lvnOPZPN3FjmcBfp3ra4iksop17iHwYMhKMpDKeqkHS8j+CPKHwmYgYzRcQyd2ba5hcAmlhkqqrj0KsxRv131a4v4wcBvgtwoNjkcvZy2E1yjAMHgvY17NwNp9oB6/a0j3uKy2ONPXKiG5UfMCGjP9GsjDm8JnOSYnJMts+Lkit44JJ4lVzvBmLgldo7i+sB0B1g+d/DLhU2SXD3DXljgOVTCe3jupIpIAiizMcjou8MpMgfcPHUnMPijlk49hJulub9fdeMtoFIYRWlkoMsoXxWiua+LenTpwpWznKdpSXmt6irJESKMLCCrCAHr65LSfrL4aluryZppJWLMzGpJP+j/mf7mvjH5T+VHlvPWPd9ye8PcW7tN/Aea++/sbOm6vz6vNtKfieWm3u9r+Dj/d7utftfk1a7vK/wDU8VO536193TeG30/LXUW3x3D+G7u78m7pq63dnsdy57X80ex+Ff3z18vt+98vWtd/prTpTUnvj/sU8z5yX/oX8Vea20NfN+6Pua+FfTu/Lo9n/tq3+jzX4/7f+L6v59Y73d/LLyXZmr/J/teb9tf3/vD/ADPc+z82rvufiPx/+7r3v2+3o/uP2+/XX/Df4+v+F/x9f+RTzf8A7tKdr89K/lr82v/Z";

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const metadata = writable({
        tags: [],
        forms: { default: {elements:[]}},
        rules: [],
        mappings: [],
        combo_values:{}
    });

    /* src\LayerStack3D.svelte generated by Svelte v3.59.2 */

    const file$9 = "src\\LayerStack3D.svelte";

    function add_css$a(target) {
    	append_styles(target, "svelte-124zhq", ".svelte-124zhq.svelte-124zhq{box-sizing:border-box}.layer-container.svelte-124zhq.svelte-124zhq{width:100px;height:100px;top:50%;left:50%;perspective:1350px;transform-style:preserve-3d}.layer.svelte-124zhq.svelte-124zhq{background-size:cover;background-position:center;width:100px;height:100px;position:absolute;transition:all 0.6s ease-in-out;cursor:pointer;z-index:1;border-radius:10px;box-shadow:1px 1px 0 1px #f9f9fb,\r\n    -1px 0 28px 0 rgba(34, 33, 81, 0.01),\r\n    28px 28px 28px 0 rgba(34, 33, 81, 0.85)}.drop-layer.svelte-124zhq.svelte-124zhq{background:radial-gradient(#0099dd, #026e81);transform:rotateX(45deg) rotateZ(45deg) translateZ(50px)}.bottom-layer.svelte-124zhq.svelte-124zhq{transform:rotateX(45deg) rotateZ(45deg) translateZ(50px)}.bottom-layer.svelte-124zhq.svelte-124zhq:hover,.bottom-layer-flat.svelte-124zhq.svelte-124zhq{transform:translate3d(0px, 50px, 50px)}.mid-layer.svelte-124zhq.svelte-124zhq{transform:rotateX(45deg) rotateZ(45deg) translateZ(100px)}.mid-layer.svelte-124zhq.svelte-124zhq:hover,.mid-layer-flat.svelte-124zhq.svelte-124zhq{transform:translate3d(0px, -100px, 50px)}.drop-ripple.svelte-124zhq.svelte-124zhq{display:inline-block;position:relative}.drop-ripple.svelte-124zhq div.svelte-124zhq{position:absolute;border:4px solid #fff;opacity:1;border-radius:50%;animation:svelte-124zhq-drop-ripples 1s cubic-bezier(0, 0.2, 0.8, 1) infinite}.drop-ripple.svelte-124zhq div.svelte-124zhq:nth-child(2){animation-delay:-0.5s}@keyframes svelte-124zhq-drop-ripples{0%{top:46px;left:46px;width:0;height:0;opacity:1}100%{top:0px;left:0px;width:92px;height:92px;opacity:0}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF5ZXJTdGFjazNELnN2ZWx0ZSIsInNvdXJjZXMiOlsiTGF5ZXJTdGFjazNELnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbjxzY3JpcHQ+XHJcbmV4cG9ydCBsZXQgbGF5ZXJzPVtdXHJcbmV4cG9ydCBsZXQgc3RhdGU9XCIzZFwiXHJcbmV4cG9ydCBsZXQgbW9kZT1cIlwiXHJcbjwvc2NyaXB0PlxyXG48ZGl2IGNsYXNzPVwibGF5ZXItY29udGFpbmVyIHN0YWNrZWQtdG9wXCI+XHJcblxyXG4gIHsjaWYgIW1vZGU9PT1cImRyb3BcIn1cclxuICAgIHsjaWYgbGF5ZXJzLmxlbmd0aD09PTB9XHJcbiAgICA8ZGl2IGNsYXNzPVwibGF5ZXIgYm90dG9tLWxheWVyIFwiIGNsYXNzOmJvdHRvbS1sYXllci1mbGF0PXtzdGF0ZT09PVwiZmxhdFwifSBzdHlsZT1cImJhY2tncm91bmQ6IHVybCgvYXBwZGF0YS9jaGVja2VyX3RodW1iLnBuZylcIj48L2Rpdj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGxheWVycy5sZW5ndGg9PT0xfVxyXG4gICAgPGRpdiBjbGFzcz1cImxheWVyIGJvdHRvbS1sYXllciBcIiAgY2xhc3M6Ym90dG9tLWxheWVyLWZsYXQ9e3N0YXRlPT09XCJmbGF0XCJ9IHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKHtsYXllcnNbMF19KTtcIj48L2Rpdj5cclxuICAgIHsvaWZ9ICBcclxuICAgIHsjaWYgbGF5ZXJzLmxlbmd0aD09PTJ9XHJcbiAgICA8ZGl2IGNsYXNzPVwibGF5ZXIgbWlkLWxheWVyIFwiICBjbGFzczptaWQtbGF5ZXItZmxhdD17c3RhdGU9PT1cImZsYXRcIn0gc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoe2xheWVyc1sxXX0pXCI+PC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwibGF5ZXIgYm90dG9tLWxheWVyIFwiIGNsYXNzOmJvdHRvbS1sYXllci1mbGF0PXtzdGF0ZT09PVwiZmxhdFwifSBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCh7bGF5ZXJzWzBdfSlcIj48L2Rpdj5cclxuICAgIHsvaWZ9ICBcclxuICB7OmVsc2V9XHJcbiAgICA8ZGl2IGNsYXNzPVwibGF5ZXIgZHJvcC1sYXllciBkcm9wLXJpcHBsZVwiICA+XHJcbiAgICAgIDxkaXY+PC9kaXY+XHJcbiAgICAgIDxkaXY+PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICB7L2lmfVxyXG5cclxuPC9kaXY+XHJcbjxzdHlsZT5cclxuICAgICAgICAgICAgKiB7XHJcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICAgICAgfVxyXG5cclxuLmxheWVyLWNvbnRhaW5lciB7XHJcbiAgICB3aWR0aDogMTAwcHg7XHJcbiAgICBoZWlnaHQ6IDEwMHB4O1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICBsZWZ0OiA1MCU7XHJcbiAgICBwZXJzcGVjdGl2ZTogMTM1MHB4O1xyXG4gICB0cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xyXG5cclxufVxyXG5cclxuLmxheWVyIHtcclxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcclxuICAgIHdpZHRoOiAxMDBweDtcclxuICAgIGhlaWdodDogMTAwcHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC42cyBlYXNlLWluLW91dDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHotaW5kZXg6IDE7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gIGJveC1zaGFkb3c6XHJcbiAgICAxcHggMXB4IDAgMXB4ICNmOWY5ZmIsXHJcbiAgICAtMXB4IDAgMjhweCAwIHJnYmEoMzQsIDMzLCA4MSwgMC4wMSksXHJcbiAgICAyOHB4IDI4cHggMjhweCAwIHJnYmEoMzQsIDMzLCA4MSwgMC44NSk7ICBcclxufVxyXG4uZHJvcC1sYXllciB7XHJcbiAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KCMwMDk5ZGQsICMwMjZlODEpO1xyXG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDQ1ZGVnKSByb3RhdGVaKDQ1ZGVnKSB0cmFuc2xhdGVaKDUwcHgpO1xyXG59XHJcblxyXG5cclxuLmJvdHRvbS1sYXllciB7XHJcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoNDVkZWcpIHJvdGF0ZVooNDVkZWcpIHRyYW5zbGF0ZVooNTBweCk7XHJcbn1cclxuLmJvdHRvbS1sYXllcjpob3ZlciwgLmJvdHRvbS1sYXllci1mbGF0IHtcclxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwcHgsIDUwcHgsIDUwcHgpO1xyXG5cclxufVxyXG4ubWlkLWxheWVyIHtcclxuICAgIHRyYW5zZm9ybTogcm90YXRlWCg0NWRlZykgcm90YXRlWig0NWRlZykgdHJhbnNsYXRlWigxMDBweCk7XHJcbn1cclxuLm1pZC1sYXllcjpob3ZlciwgLm1pZC1sYXllci1mbGF0ICB7XHJcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMHB4LCAtMTAwcHgsIDUwcHgpO1xyXG5cclxufVxyXG4udG9wLWxheWVyIHtcclxuICAgIHRyYW5zZm9ybTogcm90YXRlWCg0NWRlZykgcm90YXRlWig0NWRlZykgdHJhbnNsYXRlWigxNTBweCk7XHJcbn1cclxuXHJcbi5kcm9wLXJpcHBsZSB7XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbn1cclxuLmRyb3AtcmlwcGxlIGRpdiB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIGJvcmRlcjogNHB4IHNvbGlkICNmZmY7XHJcbiAgb3BhY2l0eTogMTtcclxuICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgYW5pbWF0aW9uOiBkcm9wLXJpcHBsZXMgMXMgY3ViaWMtYmV6aWVyKDAsIDAuMiwgMC44LCAxKSBpbmZpbml0ZTtcclxufVxyXG4uZHJvcC1yaXBwbGUgZGl2Om50aC1jaGlsZCgyKSB7XHJcbiAgYW5pbWF0aW9uLWRlbGF5OiAtMC41cztcclxufVxyXG5Aa2V5ZnJhbWVzIGRyb3AtcmlwcGxlcyB7XHJcbiAgMCUge1xyXG4gICAgdG9wOiA0NnB4O1xyXG4gICAgbGVmdDogNDZweDtcclxuICAgIHdpZHRoOiAwO1xyXG4gICAgaGVpZ2h0OiAwO1xyXG4gICAgb3BhY2l0eTogMTtcclxuICB9XHJcbiAgMTAwJSB7XHJcbiAgICB0b3A6IDBweDtcclxuICAgIGxlZnQ6IDBweDtcclxuICAgIHdpZHRoOiA5MnB4O1xyXG4gICAgaGVpZ2h0OiA5MnB4O1xyXG4gICAgb3BhY2l0eTogMDtcclxuICB9XHJcbn1cclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNkJZLDRCQUFFLENBQ0YsVUFBVSxDQUFFLFVBQ2hCLENBRVIsNENBQWlCLENBQ2IsS0FBSyxDQUFFLEtBQUssQ0FDWixNQUFNLENBQUUsS0FBSyxDQUNiLEdBQUcsQ0FBRSxHQUFHLENBQ1IsSUFBSSxDQUFFLEdBQUcsQ0FDVCxXQUFXLENBQUUsTUFBTSxDQUNwQixlQUFlLENBQUUsV0FFcEIsQ0FFQSxrQ0FBTyxDQUNMLGVBQWUsQ0FBRSxLQUFLLENBQ3RCLG1CQUFtQixDQUFFLE1BQU0sQ0FDekIsS0FBSyxDQUFFLEtBQUssQ0FDWixNQUFNLENBQUUsS0FBSyxDQUNiLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLFVBQVUsQ0FBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FDaEMsTUFBTSxDQUFFLE9BQU8sQ0FDZixPQUFPLENBQUUsQ0FBQyxDQUNWLGFBQWEsQ0FBRSxJQUFJLENBQ3JCLFVBQVUsQ0FDUixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0FBQzFCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQzFDLENBQ0EsdUNBQVksQ0FDVixVQUFVLENBQUUsZ0JBQWdCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUMzQyxTQUFTLENBQUUsUUFBUSxLQUFLLENBQUMsQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUM1RCxDQUdBLHlDQUFjLENBQ1YsU0FBUyxDQUFFLFFBQVEsS0FBSyxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FDNUQsQ0FDQSx5Q0FBYSxNQUFNLENBQUUsOENBQW1CLENBQ2xDLFNBQVMsQ0FBRSxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FFNUMsQ0FDQSxzQ0FBVyxDQUNQLFNBQVMsQ0FBRSxRQUFRLEtBQUssQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsV0FBVyxLQUFLLENBQzdELENBQ0Esc0NBQVUsTUFBTSxDQUFFLDJDQUFpQixDQUM3QixTQUFTLENBQUUsWUFBWSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBRTlDLENBS0Esd0NBQWEsQ0FDWCxPQUFPLENBQUUsWUFBWSxDQUNyQixRQUFRLENBQUUsUUFFWixDQUNBLDBCQUFZLENBQUMsaUJBQUksQ0FDZixRQUFRLENBQUUsUUFBUSxDQUNsQixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RCLE9BQU8sQ0FBRSxDQUFDLENBQ1YsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsU0FBUyxDQUFFLDBCQUFZLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFDMUQsQ0FDQSwwQkFBWSxDQUFDLGlCQUFHLFdBQVcsQ0FBQyxDQUFFLENBQzVCLGVBQWUsQ0FBRSxLQUNuQixDQUNBLFdBQVcsMEJBQWEsQ0FDdEIsRUFBRyxDQUNELEdBQUcsQ0FBRSxJQUFJLENBQ1QsSUFBSSxDQUFFLElBQUksQ0FDVixLQUFLLENBQUUsQ0FBQyxDQUNSLE1BQU0sQ0FBRSxDQUFDLENBQ1QsT0FBTyxDQUFFLENBQ1gsQ0FDQSxJQUFLLENBQ0gsR0FBRyxDQUFFLEdBQUcsQ0FDUixJQUFJLENBQUUsR0FBRyxDQUNULEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixPQUFPLENBQUUsQ0FDWCxDQUNGIn0= */");
    }

    // (21:2) {:else}
    function create_else_block$5(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "svelte-124zhq");
    			add_location(div0, file$9, 22, 6, 872);
    			attr_dev(div1, "class", "svelte-124zhq");
    			add_location(div1, file$9, 23, 6, 891);
    			attr_dev(div2, "class", "layer drop-layer drop-ripple svelte-124zhq");
    			add_location(div2, file$9, 21, 4, 820);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(21:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if !mode==="drop"}
    function create_if_block$9(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let if_block0 = /*layers*/ ctx[0].length === 0 && create_if_block_3$5(ctx);
    	let if_block1 = /*layers*/ ctx[0].length === 1 && create_if_block_2$7(ctx);
    	let if_block2 = /*layers*/ ctx[0].length === 2 && create_if_block_1$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*layers*/ ctx[0].length === 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$5(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*layers*/ ctx[0].length === 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$7(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*layers*/ ctx[0].length === 2) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$7(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(10:2) {#if !mode===\\\"drop\\\"}",
    		ctx
    	});

    	return block;
    }

    // (11:4) {#if layers.length===0}
    function create_if_block_3$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "layer bottom-layer  svelte-124zhq");
    			set_style(div, "background", "url(/appdata/checker_thumb.png)");
    			toggle_class(div, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			add_location(div, file$9, 11, 4, 192);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 2) {
    				toggle_class(div, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$5.name,
    		type: "if",
    		source: "(11:4) {#if layers.length===0}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if layers.length===1}
    function create_if_block_2$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "layer bottom-layer  svelte-124zhq");
    			set_style(div, "background-image", "url(" + /*layers*/ ctx[0][0] + ")");
    			toggle_class(div, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			add_location(div, file$9, 14, 4, 370);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*layers*/ 1) {
    				set_style(div, "background-image", "url(" + /*layers*/ ctx[0][0] + ")");
    			}

    			if (dirty & /*state*/ 2) {
    				toggle_class(div, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(14:4) {#if layers.length===1}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if layers.length===2}
    function create_if_block_1$7(ctx) {
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "layer mid-layer  svelte-124zhq");
    			set_style(div0, "background-image", "url(" + /*layers*/ ctx[0][1] + ")");
    			toggle_class(div0, "mid-layer-flat", /*state*/ ctx[1] === "flat");
    			add_location(div0, file$9, 17, 4, 543);
    			attr_dev(div1, "class", "layer bottom-layer  svelte-124zhq");
    			set_style(div1, "background-image", "url(" + /*layers*/ ctx[0][0] + ")");
    			toggle_class(div1, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			add_location(div1, file$9, 18, 4, 667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*layers*/ 1) {
    				set_style(div0, "background-image", "url(" + /*layers*/ ctx[0][1] + ")");
    			}

    			if (dirty & /*state*/ 2) {
    				toggle_class(div0, "mid-layer-flat", /*state*/ ctx[1] === "flat");
    			}

    			if (dirty & /*layers*/ 1) {
    				set_style(div1, "background-image", "url(" + /*layers*/ ctx[0][0] + ")");
    			}

    			if (dirty & /*state*/ 2) {
    				toggle_class(div1, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(17:4) {#if layers.length===2}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (!/*mode*/ ctx[2] === "drop") return create_if_block$9;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "layer-container stacked-top svelte-124zhq");
    			add_location(div, file$9, 7, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
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

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerStack3D', slots, []);
    	let { layers = [] } = $$props;
    	let { state = "3d" } = $$props;
    	let { mode = "" } = $$props;
    	const writable_props = ['layers', 'state', 'mode'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LayerStack3D> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('layers' in $$props) $$invalidate(0, layers = $$props.layers);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    	};

    	$$self.$capture_state = () => ({ layers, state, mode });

    	$$self.$inject_state = $$props => {
    		if ('layers' in $$props) $$invalidate(0, layers = $$props.layers);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [layers, state, mode];
    }

    class LayerStack3D extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { layers: 0, state: 1, mode: 2 }, add_css$a);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerStack3D",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get layers() {
    		throw new Error("<LayerStack3D>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layers(value) {
    		throw new Error("<LayerStack3D>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<LayerStack3D>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<LayerStack3D>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<LayerStack3D>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<LayerStack3D>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class mappingsHelper {

        getDefaultFields() {
            return [{name:"mergedImage",type:"image",notInRuleEditor:true},{name:"mask",type:"image",notInRuleEditor:true},{name:"hasMask",type:"boolean"},{name:"hasInitImage",type:"boolean"}
            ,{name:"prompt"},{name:"negativePrompt"},
            {name:"document_width",type:"number"},{name:"document_height",type:"number"},
            {name:"controlnet[].type"},{name:"controlnet[].image",type:"image",notInRuleEditor:true},{name:"controlnet[].strength"},{name:"controlnet[].start_percent"},{name:"controlnet[].end_percent"},{name:"controlnet[].model"}]
        }
    /**
         * get list of fields which can be used for widget mappings of each ComfyUI node:
         * fields: the form fields, defined by user
         * defaultFields: the fields whoch are usually available 
         * outputFields: the output fields, like an image or multiple images
         */
        getMappingFields(metadata) {
            let fields= [];
            if (metadata.forms && metadata.forms.default && metadata.forms.default.elements) fields=metadata.forms.default.elements;
            let defaultFields=this.getDefaultFields();
            let outputFields=[{name:"resultImage"}];
            let res= {fields:JSON.parse(JSON.stringify(fields)),defaultFields,outputFields};
            for(let i=0;i<fields.length;i++) {
                let field=fields[i];
                if (field.split_value_num && field.split_value_type) {
                    for(let k=0;k<field.split_value_num;k++) {
                        let newField={name:field.name+"_"+k,type:field.split_value_type,originalName:field.name,index:k};    // add new fields with underscore
                        res.fields.push(newField);
                    }
                }
                if (field.type==="drop_layers") {
                    if (field.num_layers===1) continue  // only one image
                    for(let k=0;k<field.num_layers;k++) {
                        let newField={name:field.name+"_"+k,type:field.type,originalName:field.name,index:k};    // add new fields with underscore
                        res.fields.push(newField);
                    }
                }
            }


            return res
        }

        getNodeByType(workflow,type) {
            return workflow.nodes.find(node => node.type === type)
          }
          getNodeById(workflow,id) {
            return workflow.nodes.find(node => node.id === id)
          }      
        addMapping(metadata,nodeId,fromField,toField) {
            if (!toField || !fromField) return
            if (!nodeId) return
            if (!metadata.mappings) metadata.mappings={};
            let mappings=metadata.mappings[nodeId];
            if (!mappings) mappings=[];
            mappings.push({ fromField,toField  });
            mappings=mappings;
            metadata.mappings[nodeId] = mappings;
        }    

        cleanUpMappings(metadata) {
            // @ts-ignore
            let workflow=window.app.graph.serialize();
            let fieldNames={};
            let allFields=this.getMappingFields(metadata);
            for(let i=0;i<allFields.fields.length;i++) {
                let field=allFields.fields[i];
                fieldNames[field.name]=true;
            }
            for(let i=0;i<allFields.defaultFields.length;i++) {
                let field=allFields.defaultFields[i];
                fieldNames[field.name]=true;
            }        
            for(let i=0;i<allFields.outputFields.length;i++) {
                let field=allFields.outputFields[i];
                fieldNames[field.name]=true;
            }        
            // only use mappsings with existing fields
            for (let nodeId in metadata.mappings) {
                let mappings=metadata.mappings[nodeId];
                let filteredArray=[];
                delete metadata.mappings[nodeId];
                if (mappings) {
                    for(let i=0;i<mappings.length;i++) {
                        let m=mappings[i];
                        if (fieldNames[m.fromField]) filteredArray.push(m);
                    }
                    if (this.getNodeById(workflow,parseInt(nodeId))) metadata.mappings[nodeId]=filteredArray;            // also check if node exists anymore                
                }
               
            }
        }

        setComboValues(combo_values) {
            // @ts-ignore
            for(let i=0;i<window.app.graph._nodes.length;i++) {
                // @ts-ignore
                let _node=window.app.graph._nodes[i];
                if  (_node && _node.widgets!=void 0) {
                    for(let k=0;k<_node.widgets.length;k++) {
                        let widget=_node.widgets[k];
                        if (widget.type==="combo" && widget.options  && widget.options.values && widget.name && widget.name!=="image") {
                            combo_values[widget.name]=widget.options.values; 
                        }
                    }
                }
            }
        }
        getSelectedComboValues() {
            let selected_combo_values=[];
            // @ts-ignore
            for(let i=0;i<window.app.graph._nodes.length;i++) {
                // @ts-ignore
                let _node=window.app.graph._nodes[i];
                if  (_node && _node.widgets!=void 0) {
                    for(let k=0;k<_node.widgets.length;k++) {
                        let widget=_node.widgets[k];
                        if (widget.type==="combo" && widget.options  && widget.options.values && widget.name && widget.name!=="image") {
                            let value=widget.value;
                            if (!selected_combo_values.includes(value)) selected_combo_values.push(value);
                        }
                    }
                }
            }
            return selected_combo_values
        }
    }

    /* src\FormElement.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1$2 } = globals;
    const file$8 = "src\\FormElement.svelte";

    function add_css$9(target) {
    	append_styles(target, "svelte-1ul0qqx", ".svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{box-sizing:border-box}.element-preview.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{position:relative;margin-bottom:20px}.element-preview.svelte-1ul0qqx .editElementButton.svelte-1ul0qqx.svelte-1ul0qqx{display:none;position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;background-color:rgb(51, 51, 51);width:50px;text-align:center}.element-preview.svelte-1ul0qqx:hover .editElementButton.svelte-1ul0qqx.svelte-1ul0qqx{display:block}.element-preview.svelte-1ul0qqx select.svelte-1ul0qqx.svelte-1ul0qqx{margin-right:10px;background-color:black;color:white;padding:5px;display:inline-block;min-width:280px}.element-preview.svelte-1ul0qqx input.svelte-1ul0qqx.svelte-1ul0qqx,textarea.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{background:none;position:relative;display:inline-block;color:white;margin:0;min-width:280px}.colorInput.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{padding:0;border:0}.textInput.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx,.textarea.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{width:280px}.element-preview.svelte-1ul0qqx label.svelte-1ul0qqx.svelte-1ul0qqx{min-width:110px;display:inline-block}.element-preview.svelte-1ul0qqx .checkboxLabel.svelte-1ul0qqx.svelte-1ul0qqx{vertical-align:5px}.element-preview.svelte-1ul0qqx .textarea_label.svelte-1ul0qqx.svelte-1ul0qqx,.element-properties.svelte-1ul0qqx .textarea_label.svelte-1ul0qqx.svelte-1ul0qqx{vertical-align:top}.element-preview.svelte-1ul0qqx .layer_image_label.svelte-1ul0qqx.svelte-1ul0qqx{vertical-align:60px}.element-preview.svelte-1ul0qqx .layer_drop_layers.svelte-1ul0qqx.svelte-1ul0qqx{vertical-align:80px}.element-preview.svelte-1ul0qqx .slider_label.svelte-1ul0qqx.svelte-1ul0qqx{vertical-align:10px}.element-properties.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{background-color:rgb(51, 51, 51);padding:10px;display:block;position:relative}.element-properties.svelte-1ul0qqx label.svelte-1ul0qqx.svelte-1ul0qqx{min-width:110px;display:inline-block}.element-properties.svelte-1ul0qqx input.svelte-1ul0qqx.svelte-1ul0qqx,textarea.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{background:none;position:relative;display:inline-block;color:white;margin:0}.formLine.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{display:block;margin-bottom:10px}.element-properties.svelte-1ul0qqx .formClose.svelte-1ul0qqx.svelte-1ul0qqx{position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;width:20px}.slidervalue.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{vertical-align:10px;margin-right:10px}.element-properties.svelte-1ul0qqx button.svelte-1ul0qqx.svelte-1ul0qqx{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:15px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}.element-properties.svelte-1ul0qqx .delete.svelte-1ul0qqx.svelte-1ul0qqx{background-color:red;color:white}.checkbox-wrapper-3.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{display:inline-block}.checkbox-wrapper-3.svelte-1ul0qqx input[type=\"checkbox\"].svelte-1ul0qqx.svelte-1ul0qqx{visibility:hidden;display:none}.checkbox-wrapper-3.svelte-1ul0qqx .toggle.svelte-1ul0qqx.svelte-1ul0qqx{position:relative;display:block;width:40px;height:20px;cursor:pointer;-webkit-tap-highlight-color:transparent;transform:translate3d(0, 0, 0)}.checkbox-wrapper-3.svelte-1ul0qqx .toggle.svelte-1ul0qqx.svelte-1ul0qqx:before{content:\"\";position:relative;top:3px;left:3px;width:34px;height:14px;display:block;background:#9A9999;border-radius:8px;transition:background 0.2s ease}.checkbox-wrapper-3.svelte-1ul0qqx .toggle span.svelte-1ul0qqx.svelte-1ul0qqx{position:absolute;top:0;left:0;width:20px;height:20px;display:block;background:white;border-radius:10px;box-shadow:0 3px 8px rgba(154, 153, 153, 0.5);transition:all 0.2s ease}.checkbox-wrapper-3.svelte-1ul0qqx .toggle span.svelte-1ul0qqx.svelte-1ul0qqx:before{content:\"\";position:absolute;display:block;margin:-18px;width:56px;height:56px;background:rgba(79, 46, 220, 0.5);border-radius:50%;transform:scale(0);opacity:1;pointer-events:none}.checkbox-wrapper-3.svelte-1ul0qqx input.svelte-1ul0qqx:checked+.toggle.svelte-1ul0qqx:before{background:rgb(227, 206, 116)}.checkbox-wrapper-3.svelte-1ul0qqx input:checked+.toggle span.svelte-1ul0qqx.svelte-1ul0qqx{background:#cda600;transform:translateX(20px);transition:all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25), background 0.15s ease;box-shadow:0 3px 8px rgba(79, 46, 220, 0.2)}.checkbox-wrapper-3.svelte-1ul0qqx input:checked+.toggle span.svelte-1ul0qqx.svelte-1ul0qqx:before{transform:scale(1);opacity:0;transition:all 0.4s ease}.showHidden.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{opacity:0.5}.drop_layers.svelte-1ul0qqx.svelte-1ul0qqx.svelte-1ul0qqx{display:inline-block;margin-top:30px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUVsZW1lbnQuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtRWxlbWVudC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAgIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSdcclxuXHJcbiAgICBleHBvcnQgbGV0IGVsZW1lbnQ7XHJcbiAgICBleHBvcnQgbGV0IHNob3dQcm9wZXJ0aWVzPWZhbHNlXHJcbiAgICBpbXBvcnQge2xheWVyX2ltYWdlX3ByZXZpZXcsbWFnbmlmaWVyX3ByZXZpZXd9IGZyb20gXCIuL2ltYWdlc1wiXHJcbiAgICBpbXBvcnQge21ldGFkYXRhfSBmcm9tIFwiLi9zdG9yZXMvbWV0YWRhdGFcIlxyXG4gICAgaW1wb3J0IExheWVyU3RhY2szRCBmcm9tIFwiLi9MYXllclN0YWNrM0Quc3ZlbHRlXCJcclxuICAgIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tICdzdmVsdGUnXHJcbiAgICBpbXBvcnQgeyBtYXBwaW5nc0hlbHBlciB9IGZyb20gJy4vbWFwcGluZ3NIZWxwZXIuanMnXHJcblxyXG4gICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxyXG4gICAgZXhwb3J0IGxldCB2YWx1ZVxyXG4gICAgZXhwb3J0IGxldCByZWFkb25seT1cIlwiXHJcblxyXG4gICAgZXhwb3J0IGxldCBub19lZGl0PWZhbHNlXHJcbiAgICBsZXQgbGF5ZXJzPVtdXHJcbiAgICBpZiAoZWxlbWVudC50eXBlPT09XCJzbGlkZXJcIikge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHZhbHVlPWVsZW1lbnQubWluXHJcbiAgICB9XHJcbiAgICAvLyBGdW5jdGlvbiB0byBpbW1lZGlhdGVseSB1cGRhdGUgdGhlIHBhcmVudCBjb21wb25lbnRcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUVsZW1lbnQodXBkYXRlZFByb3BzKSB7XHJcbiAgICAgICAgZWxlbWVudD17IC4uLmVsZW1lbnQsIC4uLnVwZGF0ZWRQcm9wcyB9XHJcbiAgICAgICAgaWYgKGVsZW1lbnQudHlwZT09PVwic2xpZGVyXCIgfHwgZWxlbWVudC50eXBlPT09XCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICB2YWx1ZT1lbGVtZW50LmRlZmF1bHRcclxuICAgICAgICAgICAgZWxlbWVudC5taW49cGFyc2VGbG9hdChlbGVtZW50Lm1pbilcclxuICAgICAgICAgICAgZWxlbWVudC5tYXg9cGFyc2VGbG9hdChlbGVtZW50Lm1heClcclxuICAgICAgICAgICAgaWYgKCFlbGVtZW50LmRlZmF1bHQpIGVsZW1lbnQuZGVmYXVsdD0wXHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGVmYXVsdD1wYXJzZUZsb2F0KGVsZW1lbnQuZGVmYXVsdClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVsZW1lbnQudHlwZT09PVwiY3VzdG9tXCIpIGdlbmVyYXRlRWxlbWVudCgpXHJcbiAgICAgICAgZGlzcGF0Y2goJ3VwZGF0ZScsIGVsZW1lbnQpICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgb3B0aW9uIHVwZGF0ZXMgZm9yIGRyb3Bkb3duc1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlT3B0aW9uQ2hhbmdlKGV2ZW50LCBpbmRleCwga2V5KSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZE9wdGlvbnMgPSBbLi4uZWxlbWVudC5vcHRpb25zXVxyXG4gICAgICAgIHVwZGF0ZWRPcHRpb25zW2luZGV4XVtrZXldID0gZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgdXBkYXRlRWxlbWVudCh7IG9wdGlvbnM6IHVwZGF0ZWRPcHRpb25zIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGEgbmV3IG9wdGlvbiB0byB0aGUgZHJvcGRvd25cclxuICAgIGZ1bmN0aW9uIGFkZE9wdGlvbigpIHtcclxuICAgICAgICB1cGRhdGVFbGVtZW50KHsgb3B0aW9uczogWy4uLmVsZW1lbnQub3B0aW9ucywgeyB0ZXh0OiAnJywga2V5OiAnJyB9XSB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBhbiBvcHRpb24gZnJvbSB0aGUgZHJvcGRvd25cclxuICAgIGZ1bmN0aW9uIHJlbW92ZU9wdGlvbihpbmRleCkge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRPcHRpb25zID0gZWxlbWVudC5vcHRpb25zLmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaW5kZXgpXHJcbiAgICAgICAgdXBkYXRlRWxlbWVudCh7IG9wdGlvbnM6IHVwZGF0ZWRPcHRpb25zIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb3BlblByb3BlcnRpZXMoKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goJ29wZW5Qcm9wZXJ0aWVzJyx7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNsb3NlUHJvcGVydGllcygpIHtcclxuICAgICAgICBkaXNwYXRjaCgnY2xvc2VQcm9wZXJ0aWVzJyx7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXCJkZWxldGVcIix7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNsb25lRWxlbWVudCgpIHtcclxuICAgICAgICBkaXNwYXRjaChcImNsb25lXCIsZWxlbWVudClcclxuICAgIH0gICAgXHJcbiAgICBmdW5jdGlvbiBjaGFuZ2VWYWx1ZShuZXdWYWx1ZSkge1xyXG4gICAgICAgIHZhbHVlPW5ld1ZhbHVlXHJcbiAgICAgICAgZGlzcGF0Y2goXCJjaGFuZ2VcIix7dmFsdWU6dmFsdWV9KVxyXG4gICAgfVxyXG5cclxuICAgIGxldCAgaHRtbFxyXG4gICAgJDoge1xyXG4gICAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuX2ZvcmNlX3JlbmRlcikge1xyXG4gICAgICAgICAgICBnZW5lcmF0ZUVsZW1lbnQoKVxyXG4gICAgICAgICAgICBlbGVtZW50Ll9mb3JjZV9yZW5kZXI9ZmFsc2VcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGZvciBjdXN0b20gZWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVFbGVtZW50KCkgeyAgIFxyXG4gICAgICAgIC8vIG5vdCB1c2luZyA8c3ZlbHRlOmVsZW1lbnQgYmVjYXVzZSB3ZSBuZWVkIGN1c3RvbSBwYXJhbWV0ZXJzXHJcbiAgICAgICAgaHRtbD1cIjxcIitlbGVtZW50LnRhZytcIiBjbGFzcz1cXFwiY3VzdG9tXFxcIiB2YWx1ZT1cXFwiXCIrdmFsdWUrXCJcXFwiIFwiXHJcbiAgICAgICAgZm9yKGxldCBuYW1lIGluIGVsZW1lbnQucGFyYW1ldGVycykgeyAgIC8vIGFkZCBtb3JlIHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgaWYgKG5hbWUhPT1cImxhYmVsXCIgJiYgbmFtZSE9PVwibmFtZVwiICYmIG5hbWUhPT1cImRlZmF1bHRcIiAmJiBuYW1lIT09XCJ2YWx1ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sKz1uYW1lK1wiPVxcXCJcIitlbGVtZW50W25hbWVdK1wiXFxcIiBcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGh0bWwrPVwiPjwvXCIrZWxlbWVudC50YWcrXCI+XCJcclxuICAgIH1cclxuICAgIG9uTW91bnQoKCkgPT4ge1xyXG4gICAgICAgIC8vIGdldCBhbGwgY29tYm8gdmFsdWVzXHJcblxyXG4gICAgICAgIGlmKCEkbWV0YWRhdGEuY29tYm9fdmFsdWVzKSAkbWV0YWRhdGEuY29tYm9fdmFsdWVzID0ge31cclxuICAgICAgICBsZXQgbWg9bmV3IG1hcHBpbmdzSGVscGVyKClcclxuICAgICAgICBtaC5zZXRDb21ib1ZhbHVlcygkbWV0YWRhdGEuY29tYm9fdmFsdWVzKVxyXG5cclxuICAgICAgICBnZW5lcmF0ZUVsZW1lbnQoKVxyXG4gICAgICAgIGlmICghZWxlbWVudFJvb3QpIHJldHVyblxyXG4gICAgICAgIGxldCBjdXN0b21FbGVtZW50cz1lbGVtZW50Um9vdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY3VzdG9tXCIpICAgICAgICAvLyBzaG91bGQgYmUgbWF4IDFcclxuICAgICAgICBpZiAoIWN1c3RvbUVsZW1lbnRzKSByZXR1cm5cclxuICAgICAgICBmb3IobGV0IGk9MDtpPGN1c3RvbUVsZW1lbnRzLmxlbmd0aDtpKyspIHsgIC8vIGZvciBub3QgcmVhbGx5IG5lZWRlZCBoZXJlXHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50PWN1c3RvbUVsZW1lbnRzW2ldXHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4gY2hhbmdlVmFsdWUoZS50YXJnZXQudmFsdWUpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0pXHJcbiAgICBleHBvcnQgbGV0IGFkdmFuY2VkT3B0aW9ucz10cnVlXHJcbiAgICBmdW5jdGlvbiBnZXRQYXJhbWV0ZXJWYWx1ZSh2YWx1ZSxkZWZhdWx0VmFsdWUpIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gZGVmYXVsdFZhbHVlXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlXHJcbiAgICB9XHJcbiAgICBsZXQgZWxlbWVudFJvb3RcclxuPC9zY3JpcHQ+XHJcblxyXG48ZGl2IGNsYXNzPVwiZWxlbWVudC1wcmV2aWV3XCIgYmluZDp0aGlzPXtlbGVtZW50Um9vdH0gY2xhc3M6c2hvd0hpZGRlbj17KGVsZW1lbnQuaGlkZGVuICYmICFlbGVtZW50LnNob3dJdCkgfHwgZWxlbWVudC5oaWRlSXR9PlxyXG4gICAgPCEtLSBFbGVtZW50IGN1c3RvbSB0YWcgLS0+XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZT09PVwiY3VzdG9tXCJ9XHJcbiAgICAgICAgeyNpZiBlbGVtZW50LmxhYmVsfVxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9PntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIHsvaWZ9XHJcbiAgICAgICAge0BodG1sIGh0bWx9XHJcbiAgICB7L2lmfVxyXG4gICAgPCEtLSBFbGVtZW50IHByZXZpZXcgYmFzZWQgb24gdHlwZSAtLT5cclxuICAgIHsjaWYgZWxlbWVudC50eXBlPT09XCJhZHZhbmNlZF9vcHRpb25zXCJ9IFxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW1pc3NpbmctYXR0cmlidXRlIC0tPlxyXG4gICAgICAgIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiB7IGFkdmFuY2VkT3B0aW9ucz0hYWR2YW5jZWRPcHRpb25zOyBkaXNwYXRjaChcInJlZHJhd0FsbFwiLHt9KSB9fT5TaG93IEFkdmFuY2VkIE9wdGlvbnM8L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcblxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGU9PT1cImxheWVyX2ltYWdlXCJ9IFxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJsYXllcl9pbWFnZV9sYWJlbFwiPntlbGVtZW50Lm5hbWV9OjwvbGFiZWw+XHJcbiAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktbWlzc2luZy1hdHRyaWJ1dGUgLS0+XHJcbiAgICAgICAgPGltZyBuYW1lPVwie2VsZW1lbnQubmFtZX1cIiBzcmM9XCJ7bGF5ZXJfaW1hZ2VfcHJldmlld31cIj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZT09PVwibWFnbmlmaWVyXCJ9IFxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCJtYWduaWZpZXJcIiBjbGFzcz1cImxheWVyX2ltYWdlX2xhYmVsXCI+TWFnbmlmaWVyOjwvbGFiZWw+XHJcbiAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktbWlzc2luZy1hdHRyaWJ1dGUgLS0+XHJcbiAgICAgICAgPGltZyBuYW1lPVwibWFnbmlmaWVyXCIgc3JjPVwie21hZ25pZmllcl9wcmV2aWV3fVwiPlxyXG4gICAgey9pZn0gICAgXHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZT09PVwiZHJvcF9sYXllcnNcIn0gXHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfSBjbGFzcz1cImxheWVyX2Ryb3BfbGF5ZXJzXCI+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgICAgIHsjZWFjaCBBcnJheShwYXJzZUludChlbGVtZW50Lm51bV9sYXllcnMpKSBhcyBfLCBpfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRyb3BfbGF5ZXJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPExheWVyU3RhY2szRCBtb2RlPVwiZHJvcFwiPjwvTGF5ZXJTdGFjazNEPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICBcclxuICAgICAgICAgICAgey9lYWNofVxyXG4gICAgey9pZn0gICAgXHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZT09PVwibGF5ZXJfaW1hZ2VfaWRzXCJ9XHJcbiAgICA8TGF5ZXJTdGFjazNEIHtsYXllcnN9PjwvTGF5ZXJTdGFjazNEPlxyXG5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ2NvbG9yX3BpY2tlcid9XHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfT57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cImNvbG9yXCIgY2xhc3M9XCJ0ZXh0SW5wdXQgY29sb3JJbnB1dFwiIHBsYWNlaG9sZGVyPVwie2VsZW1lbnQucGxhY2Vob2xkZXJ9XCIge3JlYWRvbmx5fSAge3ZhbHVlfSBvbjpjaGFuZ2U9e2UgPT4ge2NoYW5nZVZhbHVlKGUudGFyZ2V0LnZhbHVlKX19Lz5cclxuICAgIHsvaWZ9ICAgIFxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGUgPT09ICd0ZXh0J31cclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9PntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwidGV4dElucHV0XCIgcGxhY2Vob2xkZXI9XCJ7ZWxlbWVudC5wbGFjZWhvbGRlcn1cIiByZWFkb25seT17cmVhZG9ubHkgfHwgZWxlbWVudC5yZWFkb25seX0gIHt2YWx1ZX0gb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fS8+XHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAndGV4dF9vdXRwdXQnfVxyXG4gICAgICAgIHtAaHRtbCBlbGVtZW50Lmh0bWx9ICAgICBcclxuICAgIHs6ZWxzZSBpZiBlbGVtZW50LnR5cGUgPT09ICd0ZXh0YXJlYSd9XHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfSBjbGFzcz1cInRleHRhcmVhX2xhYmVsXCI+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwidGV4dGFyZWFcIiBwbGFjZWhvbGRlcj1cIntlbGVtZW50LnBsYWNlaG9sZGVyfVwiICByZWFkb25seT17cmVhZG9ubHkgfHwgZWxlbWVudC5yZWFkb25seX0gbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fT57dmFsdWV9PC90ZXh0YXJlYT5cclxuICAgIHs6ZWxzZSBpZiBlbGVtZW50LnR5cGUgPT09ICdjaGVja2JveCcgfVxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJjaGVja2JveExhYmVsXCI+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcblxyXG4gICAgICA8IS0tIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXt2YWx1ZX0gIG9uOmNoYW5nZT17ZSA9PiB7Y2hhbmdlVmFsdWUoZS50YXJnZXQudmFsdWUpfX0vPiB7ZWxlbWVudC5sYWJlbH0tLT4gIFxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hlY2tib3gtd3JhcHBlci0zXCI+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPXtlbGVtZW50Lm5hbWV9ICB7cmVhZG9ubHl9ICBjaGVja2VkPXt2YWx1ZX0gIG9uOmNoYW5nZT17ZSA9PiB7Y2hhbmdlVmFsdWUoZS50YXJnZXQudmFsdWUpfX0gLz5cclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9IGNsYXNzPVwidG9nZ2xlXCI+PHNwYW4+PC9zcGFuPjwvbGFiZWw+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ2Ryb3Bkb3duJ31cclxuICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwie2VsZW1lbnQubmFtZX1cIiBjbGFzcz1cImRyb3Bkb3duXCIgIHtyZWFkb25seX0gb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fSA+XHJcbiAgICAgICAgICAgIHsjZWFjaCBlbGVtZW50Lm9wdGlvbnMgYXMgb3B0aW9ufVxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9uLnZhbHVlfSBzZWxlY3RlZD17dmFsdWU9PT1vcHRpb24udmFsdWV9PntvcHRpb24udGV4dH0gPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgIHs6ZWxzZSBpZiBlbGVtZW50LnR5cGUgPT09ICdwcmVfZmlsbGVkX2Ryb3Bkb3duJ31cclxuICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgeyNpZiBlbGVtZW50LndpZGdldF9uYW1lICYmICRtZXRhZGF0YS5jb21ib192YWx1ZXNbZWxlbWVudC53aWRnZXRfbmFtZV0gfVxyXG4gICAgICAgIDxzZWxlY3QgbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgY2xhc3M9XCJkcm9wZG93blwiICB7cmVhZG9ubHl9IG9uOmNoYW5nZT17ZSA9PiB7Y2hhbmdlVmFsdWUoZS50YXJnZXQudmFsdWUpfX0+XHJcbiAgICAgICAgICAgIHsjZWFjaCAkbWV0YWRhdGEuY29tYm9fdmFsdWVzW2VsZW1lbnQud2lkZ2V0X25hbWVdIGFzIHZ9XHJcbiAgICAgICAgICAgICAgICB7I2lmICFlbGVtZW50LnJlZ2V4IHx8IG5ldyBSZWdFeHAoZWxlbWVudC5yZWdleCkudGVzdCh2KX1cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt2fSAgc2VsZWN0ZWQ9e3ZhbHVlPT09dn0+e3Z9IDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgey9lYWNofSBcclxuICAgICAgICA8L3NlbGVjdD4gICAgICBcclxuICAgICAgICB7OmVsc2UgaWYgIWVsZW1lbnQud2lkZ2V0X25hbWV9ICBcclxuICAgICAgICAgICAgU2VsZWN0IFdpZGdldFxyXG4gICAgICAgIHs6ZWxzZX1cclxuICAgICAgICAgICAgV2lkZ2V0IHtlbGVtZW50LndpZGdldF9uYW1lfSBub3QgZm91bmQuXHJcbiAgICAgICAgey9pZn1cclxuICAgIHs6ZWxzZSBpZiBlbGVtZW50LnR5cGUgPT09ICdzbGlkZXInfVxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJzbGlkZXJfbGFiZWxcIj57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInNsaWRlcnZhbHVlXCI+e3ZhbHVlfTwvc3Bhbj48aW5wdXQgIHJlYWRvbmx5PXtyZWFkb25seSB8fCBlbGVtZW50LnJlYWRvbmx5fSB0eXBlPVwicmFuZ2VcIiBtaW49e2VsZW1lbnQubWlufSBtYXg9e2VsZW1lbnQubWF4fSBzdGVwPXtlbGVtZW50LnN0ZXB9IHt2YWx1ZX0gbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fS8+XHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAnbnVtYmVyJ31cclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9PntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPXtlbGVtZW50Lm1pbn0gbWF4PXtlbGVtZW50Lm1heH0gIHJlYWRvbmx5PXtyZWFkb25seSB8fCBlbGVtZW50LnJlYWRvbmx5fSBzdGVwPXtlbGVtZW50LnN0ZXB9IHt2YWx1ZX0gbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fS8+XHJcbiAgICB7L2lmfSAgIFxyXG4gICAgeyNpZiByZWFkb25seSE9PVwicmVhZG9ubHlcIiAmJiAhbm9fZWRpdH1cclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgIDxkaXYgY2xhc3M9XCJlZGl0RWxlbWVudEJ1dHRvblwiIG9uOmNsaWNrPXtvcGVuUHJvcGVydGllc30+RWRpdDwvZGl2PlxyXG4gICAgey9pZn0gXHJcbjwvZGl2PlxyXG57I2lmIHNob3dQcm9wZXJ0aWVzfVxyXG48ZGl2IGNsYXNzPVwiZWxlbWVudC1wcm9wZXJ0aWVzXCIgPlxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtQ2xvc2VcIiBvbjpjbGljaz17Y2xvc2VQcm9wZXJ0aWVzfT5YPC9kaXY+XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSAhPT0gJ2xheWVyX2ltYWdlJyAmJiAgIGVsZW1lbnQudHlwZSAhPT0gJ3RleHRfb3V0cHV0JyAmJiBlbGVtZW50LnR5cGUhPT1cImFkdmFuY2VkX29wdGlvbnNcIiAgJiYgZWxlbWVudC50eXBlIT09XCJjdXN0b21cIiAmJiBlbGVtZW50LnR5cGUhPT1cIm1hZ25pZmllclwiICYmIGVsZW1lbnQudHlwZSE9PVwiZHJvcF9sYXllcnNcIn0gXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCIgPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibGFiZWxcIj5MYWJlbDo8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibGFiZWxcIiB2YWx1ZT17ZWxlbWVudC5sYWJlbH0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgbGFiZWw6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm5hbWVcIj4gTmFtZTogPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAgdmFsdWU9e2VsZW1lbnQubmFtZX0gb246Y2hhbmdlPXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IG5hbWU6IGUudGFyZ2V0LnZhbHVlIH0pIH0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJkZWZhdWx0XCI+IERlZmF1bHQgdmFsdWU6IDwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRlZmF1bHRcIiB2YWx1ZT17ZWxlbWVudC5kZWZhdWx0fSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBkZWZhdWx0OiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj4gICAgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwiaGlkZGVuXCI+SGlkZGVuOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImhpZGRlblwiIGJpbmQ6Y2hlY2tlZD17ZWxlbWVudC5oaWRkZW59ICAvPiBIaWRlIElucHV0IGluIGZvcm1cclxuICAgICAgICA8L2Rpdj4gICAgICAgXHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGU9PT1cInNsaWRlclwiIHx8IGVsZW1lbnQudHlwZT09PVwidGV4dFwiIHx8IGVsZW1lbnQudHlwZT09PVwidGV4dGFyZWFcIiB8fCBlbGVtZW50LnR5cGU9PT1cIm51bWJlclwifVxyXG4gICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgPGxhYmVsICBmb3I9XCJoaWRkZW5cIj5IaWRkZW46IDwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJoaWRkZW5cIiBiaW5kOmNoZWNrZWQ9e2VsZW1lbnQucmVhZG9ubHl9ICAvPiBSZWFkb25seVxyXG4gICAgPC9kaXY+ICAgIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlPT09XCJjdXN0b21cIn1cclxuICAgICAgICAgICAgeyNlYWNoIE9iamVjdC5lbnRyaWVzKGVsZW1lbnQucGFyYW1ldGVycykgYXMgW25hbWUsIHBdfVxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgeyNpZiBwLnR5cGU9PT1cInRleHRcIn1cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgIGZvcj1cIntuYW1lfVwiPntwLmxhYmVsfTogPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB7bmFtZX0gdmFsdWU9e2VsZW1lbnRbbmFtZV19IG9uOmNoYW5nZT17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9iaj17fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbbmFtZV09ZS50YXJnZXQudmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudChvYmopfX0gLz5cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICB7I2lmIHAudHlwZT09PVwidGV4dGFyZWFcIn1cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgIGZvcj1cIntuYW1lfVwiIGNsYXNzPVwidGV4dGFyZWFfbGFiZWxcIj57cC5sYWJlbH06IDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwidGV4dGFyZWFcIiB7bmFtZX0gb246Y2hhbmdlPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2JqPXt9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtuYW1lXT1lLnRhcmdldC52YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50KG9iail9fSA+e2VsZW1lbnRbbmFtZV19PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgIHsvaWZ9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cImhpZGRlblwiPkhpZGRlbjogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJoaWRkZW5cIiBiaW5kOmNoZWNrZWQ9e2VsZW1lbnQuaGlkZGVufSAgLz4gSGlkZSBJbnB1dCBpbiBmb3JtXHJcbiAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAndGV4dCcgfHwgZWxlbWVudC50eXBlID09PSAndGV4dGFyZWEnIHx8IGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicgIHx8IGVsZW1lbnQudHlwZSA9PT0gJ2NvbG9yX3BpY2tlcid9XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwicGxhY2Vob2xkZXJcIj4gUGxhY2Vob2xkZXI6IDwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInBsYWNlaG9sZGVyXCIgdmFsdWU9e2VsZW1lbnQucGxhY2Vob2xkZXJ9IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IHBsYWNlaG9sZGVyOiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj4gIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAndGV4dF9vdXRwdXQnfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm5hbWVcIj4gTmFtZTogPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAgdmFsdWU9e2VsZW1lbnQubmFtZX0gb246Y2hhbmdlPXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IG5hbWU6IGUudGFyZ2V0LnZhbHVlIH0pIH0gLz5cclxuICAgICAgICA8L2Rpdj4gICAgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwiaHRtbFwiPiBIVE1ML1RleHQ6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDx0ZXh0YXJlYSAgbmFtZT1cImh0bWxcIiB2YWx1ZT17ZWxlbWVudC5odG1sfSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBodG1sOiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj4gIFxyXG4gICAgey9pZn0gICAgXHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ2xheWVyX2ltYWdlJyB9XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwibmFtZVwiPiBOYW1lOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPXtlbGVtZW50Lm5hbWV9IG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBuYW1lOiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJmcm9tX3NlbGVjdGlvblwiPlBpeGVsIERhdGE6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiZnJvbV9zZWxlY3Rpb25cIiBiaW5kOmNoZWNrZWQ9e2VsZW1lbnQuZnJvbV9zZWxlY3Rpb259ICAvPiBGcm9tIFNlbGVjdGlvblxyXG4gICAgICAgIDwvZGl2PiAgICAgIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAnZHJvcF9sYXllcnMnIH1cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJuYW1lXCI+IE5hbWU6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgdmFsdWU9e2VsZW1lbnQubmFtZX0gb246Y2hhbmdlPXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IG5hbWU6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm5hbWVcIj4gTGFiZWw6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgdmFsdWU9e2VsZW1lbnQubGFiZWx9IG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBsYWJlbDogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+ICAgIFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm5hbWVcIj4gTnVtYmVyOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPXtlbGVtZW50Lm51bV9sYXllcnN9IG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBudW1fbGF5ZXJzOiBwYXJzZUludChlLnRhcmdldC52YWx1ZSkgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+ICAgICAgICAgICAgXHJcbiAgICB7L2lmfSAgICBcclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAnZHJvcGRvd24nfVxyXG4gICAgICAgIHsjZWFjaCBlbGVtZW50Lm9wdGlvbnMgYXMgb3B0aW9uLCBpbmRleH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwidGV4dFwiPk9wdGlvbiBUZXh0OjwvbGFiZWw+IDxpbnB1dCBuYW1lPVwidGV4dFwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e29wdGlvbi50ZXh0fSBvbjppbnB1dD17KGUpID0+IGhhbmRsZU9wdGlvbkNoYW5nZShlLCBpbmRleCwgJ3RleHQnKX0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImtleVwiPk9wdGlvbiBWYWx1ZTo8L2xhYmVsPiA8aW5wdXQgbmFtZT1cInZhbHVlXCIgdHlwZT1cInRleHRcIiB2YWx1ZT17b3B0aW9uLnZhbHVlfSBvbjppbnB1dD17KGUpID0+IGhhbmRsZU9wdGlvbkNoYW5nZShlLCBpbmRleCwgJ3ZhbHVlJyl9IC8+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKSA9PiByZW1vdmVPcHRpb24oaW5kZXgpfT5SZW1vdmUgT3B0aW9uPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXthZGRPcHRpb259PkFkZCBPcHRpb248L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3ByZV9maWxsZWRfZHJvcGRvd24nfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIndpZGdldF9uYW1lXCI+IENvbWJvIFdpZGdldDogPC9sYWJlbD5cclxuICAgICAgICAgICAgPHNlbGVjdCAgbmFtZT1cIndpZGdldF9uYW1lXCIgIG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyB3aWRnZXRfbmFtZTogZS50YXJnZXQudmFsdWUgfSl9IGJpbmQ6dmFsdWU9e2VsZW1lbnQud2lkZ2V0X25hbWV9ICA+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uPlNlbGVjdC4uLjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEuY29tYm9fdmFsdWVzfVxyXG4gICAgICAgICAgICAgICAgICAgIHsjZWFjaCBPYmplY3QuZW50cmllcygkbWV0YWRhdGEuY29tYm9fdmFsdWVzKSBhcyBbd2lkZ2V0X25hbWUsdmFsdWVzXX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17d2lkZ2V0X25hbWV9Pnt3aWRnZXRfbmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJyZXhleFwiPiBGaWx0ZXIgUmVnRXg6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJyZWdleFwiIHZhbHVlPXtnZXRQYXJhbWV0ZXJWYWx1ZShlbGVtZW50LnJlZ2V4LFwiXCIpfSBvbjpjaGFuZ2U9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgcmVnZXg6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PiAgICAgICAgICAgIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAnc2xpZGVyJyB8fCBlbGVtZW50LnR5cGUgPT09ICdudW1iZXInfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibWluXCI+IE1pbjogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJtaW5cIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e2VsZW1lbnQubWlufSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBtaW46IGUudGFyZ2V0LnZhbHVlIH0pfSAvPiAgXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwibWF4XCI+IE1heDo8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgbmFtZT1cIm1heFwiIHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17ZWxlbWVudC5tYXh9IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IG1heDogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+IFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwic3RlcFwiPiBTdGVwOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgbmFtZT1cInN0ZXBcIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e2VsZW1lbnQuc3RlcH0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgc3RlcDogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICA8L2Rpdj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcid9XHJcbiAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKT0+eyAgdXBkYXRlRWxlbWVudCh7IHR5cGU6IFwic2xpZGVyXCIgfSkgfX0+Q29udmVydCB0byBTbGlkZXI8L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3NsaWRlcid9XHJcbiAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKT0+eyAgdXBkYXRlRWxlbWVudCh7IHR5cGU6IFwibnVtYmVyXCIgfSkgfX0+Q29udmVydCB0byBOdW1iZXI8L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcbiAgICA8ZGl2PjxidXR0b24gb246Y2xpY2s9eygpID0+IGRlbGV0ZUVsZW1lbnQoKX0gY2xhc3M9XCJkZWxldGVcIj5EZWxldGU8L2J1dHRvbj4gPGJ1dHRvbiBvbjpjbGljaz17KCkgPT4gY2xvbmVFbGVtZW50KCl9ID5DbG9uZTwvYnV0dG9uPjwvZGl2PlxyXG5cclxuPC9kaXY+XHJcbnsvaWZ9XHJcblxyXG48c3R5bGU+XHJcbiAgICAqIHtcclxuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG5cclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcge1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyAuZWRpdEVsZW1lbnRCdXR0b24ge1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIHJpZ2h0OjBweDtcclxuICAgICAgICB0b3A6IDBweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgcGFkZGluZzogNXB4O1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1MSwgNTEsIDUxKTtcclxuICAgICAgICB3aWR0aDo1MHB4O1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIH1cclxuXHJcbiAgICAuZWxlbWVudC1wcmV2aWV3OmhvdmVyIC5lZGl0RWxlbWVudEJ1dHRvbiB7XHJcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IHNlbGVjdCB7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICBwYWRkaW5nOiA1cHg7ICAgXHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIG1pbi13aWR0aDogMjgwcHg7XHJcblxyXG4gIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgaW5wdXQsdGV4dGFyZWEge1xyXG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICBjb2xvcjp3aGl0ZTtcclxuICAgICAgICBtYXJnaW46IDA7XHJcbiAgICAgICAgbWluLXdpZHRoOiAyODBweDtcclxuICAgIH1cclxuICAgIC5jb2xvcklucHV0IHtcclxuICAgICAgICBwYWRkaW5nOjA7XHJcbiAgICAgICAgYm9yZGVyOjA7XHJcbiAgICB9XHJcbiAgICAudGV4dElucHV0LC50ZXh0YXJlYSB7XHJcbiAgICAgICAgd2lkdGg6IDI4MHB4O1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyBsYWJlbCB7XHJcbiAgICAgICAgbWluLXdpZHRoOiAxMTBweDtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IC5jaGVja2JveExhYmVsIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogNXB4O1xyXG5cclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgLnRleHRhcmVhX2xhYmVsLCAuZWxlbWVudC1wcm9wZXJ0aWVzIC50ZXh0YXJlYV9sYWJlbCB7XHJcbiAgICAgICAgdmVydGljYWwtYWxpZ246IHRvcDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgLmxheWVyX2ltYWdlX2xhYmVsIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogNjBweDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgLmxheWVyX2Ryb3BfbGF5ZXJzIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogODBweDtcclxuICAgIH0gICAgXHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IC5zbGlkZXJfbGFiZWwge1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiAxMHB4O1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDUxLCA1MSwgNTEpO1xyXG4gICAgICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICAgICAgZGlzcGxheTpibG9jaztcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblxyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyBsYWJlbCB7XHJcbiAgICAgICAgbWluLXdpZHRoOiAxMTBweDtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIGlucHV0LHRleHRhcmVhIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgY29sb3I6d2hpdGU7XHJcbiAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICAuZm9ybUxpbmUge1xyXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIC5mb3JtQ2xvc2Uge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICByaWdodDowcHg7XHJcbiAgICAgICAgdG9wOiAwcHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDtcclxuICAgICAgICB3aWR0aDogMjBweDtcclxuICAgIH0gICAgXHJcbiBcclxuICAgIC5zbGlkZXJ2YWx1ZSB7XHJcbiAgICAgICAgdmVydGljYWwtYWxpZ246IDEwcHg7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfSBcclxuICAgIC5lbGVtZW50LXByb3BlcnRpZXMgYnV0dG9uIHtcclxuICAgICAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgbWluLXdpZHRoOiA3MHB4O1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9XHJcblxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyAuZGVsZXRlIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgfSAgICAgICBcclxuLyogY2hlY2tib3ggKi9cclxuLmNoZWNrYm94LXdyYXBwZXItMyB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbn0gLmNoZWNrYm94LXdyYXBwZXItMyBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0ge1xyXG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICB9XHJcblxyXG4gIC5jaGVja2JveC13cmFwcGVyLTMgLnRvZ2dsZSB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIHdpZHRoOiA0MHB4O1xyXG4gICAgaGVpZ2h0OiAyMHB4O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7XHJcbiAgfVxyXG4gIC5jaGVja2JveC13cmFwcGVyLTMgLnRvZ2dsZTpiZWZvcmUge1xyXG4gICAgY29udGVudDogXCJcIjtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHRvcDogM3B4O1xyXG4gICAgbGVmdDogM3B4O1xyXG4gICAgd2lkdGg6IDM0cHg7XHJcbiAgICBoZWlnaHQ6IDE0cHg7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIGJhY2tncm91bmQ6ICM5QTk5OTk7XHJcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMnMgZWFzZTtcclxuICB9XHJcbiAgLmNoZWNrYm94LXdyYXBwZXItMyAudG9nZ2xlIHNwYW4ge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgaGVpZ2h0OiAyMHB4O1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICBib3gtc2hhZG93OiAwIDNweCA4cHggcmdiYSgxNTQsIDE1MywgMTUzLCAwLjUpO1xyXG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcclxuICB9XHJcbiAgLmNoZWNrYm94LXdyYXBwZXItMyAudG9nZ2xlIHNwYW46YmVmb3JlIHtcclxuICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG1hcmdpbjogLTE4cHg7XHJcbiAgICB3aWR0aDogNTZweDtcclxuICAgIGhlaWdodDogNTZweDtcclxuICAgIGJhY2tncm91bmQ6IHJnYmEoNzksIDQ2LCAyMjAsIDAuNSk7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDApO1xyXG4gICAgb3BhY2l0eTogMTtcclxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gIH1cclxuXHJcbiAgLmNoZWNrYm94LXdyYXBwZXItMyBpbnB1dDpjaGVja2VkICsgLnRvZ2dsZTpiZWZvcmUge1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gIH1cclxuICAuY2hlY2tib3gtd3JhcHBlci0zIGlucHV0OmNoZWNrZWQgKyAudG9nZ2xlIHNwYW4ge1xyXG4gICAgYmFja2dyb3VuZDogI2NkYTYwMDtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyMHB4KTtcclxuICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGN1YmljLWJlemllcigwLjgsIDAuNCwgMC4zLCAxLjI1KSwgYmFja2dyb3VuZCAwLjE1cyBlYXNlO1xyXG4gICAgYm94LXNoYWRvdzogMCAzcHggOHB4IHJnYmEoNzksIDQ2LCAyMjAsIDAuMik7XHJcbiAgfVxyXG4gIC5jaGVja2JveC13cmFwcGVyLTMgaW5wdXQ6Y2hlY2tlZCArIC50b2dnbGUgc3BhbjpiZWZvcmUge1xyXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC40cyBlYXNlO1xyXG4gIH1cclxuICAuc2hvd0hpZGRlbiB7XHJcbiAgICBvcGFjaXR5OiAwLjU7XHJcbiAgfVxyXG5cclxuICAuZHJvcF9sYXllcnMge1xyXG4gICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbiAgICBtYXJnaW4tdG9wOjMwcHg7XHJcbiAgfVxyXG48L3N0eWxlPlxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa1dJLDZDQUFFLENBQ0UsVUFBVSxDQUFFLFVBRWhCLENBQ0EsNkRBQWlCLENBQ2IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsYUFBYSxDQUFFLElBQ25CLENBQ0EsK0JBQWdCLENBQUMsZ0RBQW1CLENBQ2hDLE9BQU8sQ0FBRSxJQUFJLENBQ2IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsTUFBTSxHQUFHLENBQ1QsR0FBRyxDQUFFLEdBQUcsQ0FDUixNQUFNLENBQUUsT0FBTyxDQUNmLE9BQU8sQ0FBRSxHQUFHLENBQ1osZ0JBQWdCLENBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDakMsTUFBTSxJQUFJLENBQ1YsVUFBVSxDQUFFLE1BQ2hCLENBRUEsK0JBQWdCLE1BQU0sQ0FBQyxnREFBbUIsQ0FDdEMsT0FBTyxDQUFFLEtBQ2IsQ0FDQSwrQkFBZ0IsQ0FBQyxvQ0FBTyxDQUNwQixZQUFZLENBQUUsSUFBSSxDQUNsQixnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLEtBQUssQ0FBRSxLQUFLLENBQ1osT0FBTyxDQUFFLEdBQUcsQ0FDWixPQUFPLENBQUUsWUFBWSxDQUNyQixTQUFTLENBQUUsS0FFakIsQ0FDRSwrQkFBZ0IsQ0FBQyxtQ0FBSyxDQUFDLHFEQUFTLENBQzVCLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE9BQU8sQ0FBRSxZQUFZLENBQ3JCLE1BQU0sS0FBSyxDQUNYLE1BQU0sQ0FBRSxDQUFDLENBQ1QsU0FBUyxDQUFFLEtBQ2YsQ0FDQSx3REFBWSxDQUNSLFFBQVEsQ0FBQyxDQUNULE9BQU8sQ0FDWCxDQUNBLHVEQUFVLENBQUMsc0RBQVUsQ0FDakIsS0FBSyxDQUFFLEtBQ1gsQ0FDQSwrQkFBZ0IsQ0FBQyxtQ0FBTSxDQUNuQixTQUFTLENBQUUsS0FBSyxDQUNoQixPQUFPLENBQUUsWUFDYixDQUNBLCtCQUFnQixDQUFDLDRDQUFlLENBQzVCLGNBQWMsQ0FBRSxHQUVwQixDQUNBLCtCQUFnQixDQUFDLDZDQUFlLENBQUUsa0NBQW1CLENBQUMsNkNBQWdCLENBQ2xFLGNBQWMsQ0FBRSxHQUNwQixDQUNBLCtCQUFnQixDQUFDLGdEQUFtQixDQUNoQyxjQUFjLENBQUUsSUFDcEIsQ0FDQSwrQkFBZ0IsQ0FBQyxnREFBbUIsQ0FDaEMsY0FBYyxDQUFFLElBQ3BCLENBQ0EsK0JBQWdCLENBQUMsMkNBQWMsQ0FDM0IsY0FBYyxDQUFFLElBQ3BCLENBQ0EsZ0VBQW9CLENBQ2hCLGdCQUFnQixDQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ2pDLE9BQU8sQ0FBRSxJQUFJLENBQ2IsUUFBUSxLQUFLLENBQ2IsUUFBUSxDQUFFLFFBRWQsQ0FDQSxrQ0FBbUIsQ0FBQyxtQ0FBTSxDQUN0QixTQUFTLENBQUUsS0FBSyxDQUNoQixPQUFPLENBQUUsWUFDYixDQUNBLGtDQUFtQixDQUFDLG1DQUFLLENBQUMscURBQVMsQ0FDL0IsVUFBVSxDQUFFLElBQUksQ0FDaEIsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLFlBQVksQ0FDckIsTUFBTSxLQUFLLENBQ1gsTUFBTSxDQUFFLENBQ1osQ0FFQSxzREFBVSxDQUNOLE9BQU8sQ0FBRSxLQUFLLENBQ2QsYUFBYSxDQUFFLElBQ25CLENBQ0Esa0NBQW1CLENBQUMsd0NBQVcsQ0FDM0IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsTUFBTSxHQUFHLENBQ1QsR0FBRyxDQUFFLEdBQUcsQ0FDUixNQUFNLENBQUUsT0FBTyxDQUNmLE9BQU8sQ0FBRSxHQUFHLENBQ1osS0FBSyxDQUFFLElBQ1gsQ0FFQSx5REFBYSxDQUNULGNBQWMsQ0FBRSxJQUFJLENBQ3BCLFlBQVksQ0FBRSxJQUNsQixDQUNBLGtDQUFtQixDQUFDLG9DQUFPLENBQ3ZCLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLFNBQVMsQ0FBRSxJQUFJLENBQ2YsU0FBUyxDQUFFLElBQUksQ0FDZixLQUFLLENBQUUsS0FBSyxDQUNaLGdCQUFnQixDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ3BDLFlBQVksQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNoQyxhQUFhLENBQUUsR0FBRyxDQUNsQixNQUFNLENBQUUsT0FBTyxDQUNmLFlBQVksQ0FBRSxJQUNsQixDQUVBLGtDQUFtQixDQUFDLHFDQUFRLENBQ3hCLGdCQUFnQixDQUFFLEdBQUcsQ0FDckIsS0FBSyxDQUFFLEtBQ1gsQ0FFSixnRUFBb0IsQ0FDaEIsT0FBTyxDQUFFLFlBQ2IsQ0FBRSxrQ0FBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsK0JBQUUsQ0FDekMsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsT0FBTyxDQUFFLElBQ1gsQ0FFQSxrQ0FBbUIsQ0FBQyxxQ0FBUSxDQUMxQixRQUFRLENBQUUsUUFBUSxDQUNsQixPQUFPLENBQUUsS0FBSyxDQUNkLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsT0FBTyxDQUNmLDJCQUEyQixDQUFFLFdBQVcsQ0FDeEMsU0FBUyxDQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNoQyxDQUNBLGtDQUFtQixDQUFDLHFDQUFPLE9BQVEsQ0FDakMsT0FBTyxDQUFFLEVBQUUsQ0FDWCxRQUFRLENBQUUsUUFBUSxDQUNsQixHQUFHLENBQUUsR0FBRyxDQUNSLElBQUksQ0FBRSxHQUFHLENBQ1QsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE9BQU8sQ0FBRSxLQUFLLENBQ2QsVUFBVSxDQUFFLE9BQU8sQ0FDbkIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsVUFBVSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFDOUIsQ0FDQSxrQ0FBbUIsQ0FBQyxPQUFPLENBQUMsa0NBQUssQ0FDL0IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLENBQUMsQ0FDTixJQUFJLENBQUUsQ0FBQyxDQUNQLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixPQUFPLENBQUUsS0FBSyxDQUNkLFVBQVUsQ0FBRSxLQUFLLENBQ2pCLGFBQWEsQ0FBRSxJQUFJLENBQ25CLFVBQVUsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUM5QyxVQUFVLENBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUN2QixDQUNBLGtDQUFtQixDQUFDLE9BQU8sQ0FBQyxrQ0FBSSxPQUFRLENBQ3RDLE9BQU8sQ0FBRSxFQUFFLENBQ1gsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLEtBQUssQ0FDZCxNQUFNLENBQUUsS0FBSyxDQUNiLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixVQUFVLENBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDbEMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsU0FBUyxDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQ25CLE9BQU8sQ0FBRSxDQUFDLENBQ1YsY0FBYyxDQUFFLElBQ2xCLENBRUEsa0NBQW1CLENBQUMsb0JBQUssUUFBUSxDQUFHLHNCQUFPLE9BQVEsQ0FDakQsVUFBVSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUMvQixDQUNBLGtDQUFtQixDQUFDLEtBQUssUUFBUSxDQUFHLE9BQU8sQ0FBQyxrQ0FBSyxDQUMvQyxVQUFVLENBQUUsT0FBTyxDQUNuQixTQUFTLENBQUUsV0FBVyxJQUFJLENBQUMsQ0FDM0IsVUFBVSxDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUM3RSxVQUFVLENBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQzdDLENBQ0Esa0NBQW1CLENBQUMsS0FBSyxRQUFRLENBQUcsT0FBTyxDQUFDLGtDQUFJLE9BQVEsQ0FDdEQsU0FBUyxDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQ25CLE9BQU8sQ0FBRSxDQUFDLENBQ1YsVUFBVSxDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFDdkIsQ0FDQSx3REFBWSxDQUNWLE9BQU8sQ0FBRSxHQUNYLENBRUEseURBQWEsQ0FDWCxRQUFRLFlBQVksQ0FDcEIsV0FBVyxJQUNiIn0= */");
    }

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[60] = list[i][0];
    	child_ctx[61] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[64] = list[i];
    	child_ctx[66] = i;
    	return child_ctx;
    }

    function get_each_context_2$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[67] = list[i][0];
    	child_ctx[68] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_4$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[73] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[64] = list[i];
    	return child_ctx;
    }

    function get_each_context_5$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[76] = list[i];
    	child_ctx[78] = i;
    	return child_ctx;
    }

    // (117:4) {#if element.type==="custom"}
    function create_if_block_34$1(ctx) {
    	let t;
    	let html_tag;
    	let html_anchor;
    	let if_block = /*element*/ ctx[0].label && create_if_block_35$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			html_tag.m(/*html*/ ctx[6], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*element*/ ctx[0].label) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_35$1(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*html*/ 64) html_tag.p(/*html*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_34$1.name,
    		type: "if",
    		source: "(117:4) {#if element.type===\\\"custom\\\"}",
    		ctx
    	});

    	return block;
    }

    // (118:8) {#if element.label}
    function create_if_block_35$1(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 118, 12, 4040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_35$1.name,
    		type: "if",
    		source: "(118:8) {#if element.label}",
    		ctx
    	});

    	return block;
    }

    // (124:4) {#if element.type==="advanced_options"}
    function create_if_block_33$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Show Advanced Options";
    			attr_dev(button, "class", "svelte-1ul0qqx");
    			add_location(button, file$8, 125, 8, 4293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[20], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_33$1.name,
    		type: "if",
    		source: "(124:4) {#if element.type===\\\"advanced_options\\\"}",
    		ctx
    	});

    	return block;
    }

    // (129:4) {#if element.type==="layer_image"}
    function create_if_block_32$1(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let img;
    	let img_name_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			img = element("img");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "layer_image_label svelte-1ul0qqx");
    			add_location(label, file$8, 129, 8, 4476);
    			attr_dev(img, "name", img_name_value = /*element*/ ctx[0].name);
    			if (!src_url_equal(img.src, img_src_value = layer_image_preview)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1ul0qqx");
    			add_location(img, file$8, 131, 8, 4616);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && img_name_value !== (img_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(img, "name", img_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_32$1.name,
    		type: "if",
    		source: "(129:4) {#if element.type===\\\"layer_image\\\"}",
    		ctx
    	});

    	return block;
    }

    // (134:4) {#if element.type==="magnifier"}
    function create_if_block_31$1(ctx) {
    	let label;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Magnifier:";
    			t1 = space();
    			img = element("img");
    			attr_dev(label, "for", "magnifier");
    			attr_dev(label, "class", "layer_image_label svelte-1ul0qqx");
    			add_location(label, file$8, 134, 8, 4731);
    			attr_dev(img, "name", "magnifier");
    			if (!src_url_equal(img.src, img_src_value = magnifier_preview)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1ul0qqx");
    			add_location(img, file$8, 136, 8, 4863);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_31$1.name,
    		type: "if",
    		source: "(134:4) {#if element.type===\\\"magnifier\\\"}",
    		ctx
    	});

    	return block;
    }

    // (139:4) {#if element.type==="drop_layers"}
    function create_if_block_30$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let each_1_anchor;
    	let current;
    	let each_value_5 = Array(parseInt(/*element*/ ctx[0].num_layers));
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5$3(get_each_context_5$3(ctx, each_value_5, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "layer_drop_layers svelte-1ul0qqx");
    			add_location(label, file$8, 139, 8, 4977);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*element*/ 1) && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element*/ 1) {
    				each_value_5 = Array(parseInt(/*element*/ ctx[0].num_layers));
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5$3(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_5$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_5.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_5.length; i += 1) {
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
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_30$2.name,
    		type: "if",
    		source: "(139:4) {#if element.type===\\\"drop_layers\\\"}",
    		ctx
    	});

    	return block;
    }

    // (141:12) {#each Array(parseInt(element.num_layers)) as _, i}
    function create_each_block_5$3(ctx) {
    	let div;
    	let layerstack3d;
    	let t;
    	let current;
    	layerstack3d = new LayerStack3D({ props: { mode: "drop" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(layerstack3d.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "drop_layers svelte-1ul0qqx");
    			add_location(div, file$8, 141, 16, 5136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(layerstack3d, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layerstack3d.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layerstack3d.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(layerstack3d);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5$3.name,
    		type: "each",
    		source: "(141:12) {#each Array(parseInt(element.num_layers)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (147:4) {#if element.type==="layer_image_ids"}
    function create_if_block_29$2(ctx) {
    	let layerstack3d;
    	let current;

    	layerstack3d = new LayerStack3D({
    			props: { layers: /*layers*/ ctx[10] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layerstack3d.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layerstack3d, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layerstack3d.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layerstack3d.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layerstack3d, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_29$2.name,
    		type: "if",
    		source: "(147:4) {#if element.type===\\\"layer_image_ids\\\"}",
    		ctx
    	});

    	return block;
    }

    // (151:4) {#if element.type === 'color_picker'}
    function create_if_block_28$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let input;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 151, 8, 5446);
    			attr_dev(input, "type", "color");
    			attr_dev(input, "class", "textInput colorInput svelte-1ul0qqx");
    			attr_dev(input, "placeholder", input_placeholder_value = /*element*/ ctx[0].placeholder);
    			input.readOnly = /*readonly*/ ctx[4];
    			input.value = /*value*/ ctx[1];
    			add_location(input, file$8, 152, 8, 5506);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[21], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_placeholder_value !== (input_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[4]);
    			}

    			if (dirty[0] & /*value*/ 2) {
    				prop_dev(input, "value", /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_28$2.name,
    		type: "if",
    		source: "(151:4) {#if element.type === 'color_picker'}",
    		ctx
    	});

    	return block;
    }

    // (198:40) 
    function create_if_block_27$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let input;
    	let input_min_value;
    	let input_max_value;
    	let input_readonly_value;
    	let input_step_value;
    	let input_name_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 198, 8, 8455);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			input.readOnly = input_readonly_value = /*readonly*/ ctx[4] || /*element*/ ctx[0].readonly;
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = /*value*/ ctx[1];
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-1ul0qqx");
    			add_location(input, file$8, 199, 8, 8515);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler_7*/ ctx[28], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_min_value !== (input_min_value = /*element*/ ctx[0].min)) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_max_value !== (input_max_value = /*element*/ ctx[0].max)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty[0] & /*readonly, element, $metadata*/ 273 && input_readonly_value !== (input_readonly_value = /*readonly*/ ctx[4] || /*element*/ ctx[0].readonly)) {
    				prop_dev(input, "readOnly", input_readonly_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_step_value !== (input_step_value = /*element*/ ctx[0].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				prop_dev(input, "value", /*value*/ ctx[1]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_name_value !== (input_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(input, "name", input_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_27$2.name,
    		type: "if",
    		source: "(198:40) ",
    		ctx
    	});

    	return block;
    }

    // (195:40) 
    function create_if_block_26$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let span;
    	let t3;
    	let input;
    	let input_readonly_value;
    	let input_min_value;
    	let input_max_value;
    	let input_step_value;
    	let input_name_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			span = element("span");
    			t3 = text(/*value*/ ctx[1]);
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "slider_label svelte-1ul0qqx");
    			add_location(label, file$8, 195, 8, 8087);
    			attr_dev(span, "class", "slidervalue svelte-1ul0qqx");
    			add_location(span, file$8, 196, 8, 8168);
    			input.readOnly = input_readonly_value = /*readonly*/ ctx[4] || /*element*/ ctx[0].readonly;
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = /*value*/ ctx[1];
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-1ul0qqx");
    			add_location(input, file$8, 196, 48, 8208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t3);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler_6*/ ctx[27], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*value*/ 2) set_data_dev(t3, /*value*/ ctx[1]);

    			if (dirty[0] & /*readonly, element, $metadata*/ 273 && input_readonly_value !== (input_readonly_value = /*readonly*/ ctx[4] || /*element*/ ctx[0].readonly)) {
    				prop_dev(input, "readOnly", input_readonly_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_min_value !== (input_min_value = /*element*/ ctx[0].min)) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_max_value !== (input_max_value = /*element*/ ctx[0].max)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_step_value !== (input_step_value = /*element*/ ctx[0].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty[0] & /*value*/ 2) {
    				prop_dev(input, "value", /*value*/ ctx[1]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_name_value !== (input_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(input, "name", input_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_26$2.name,
    		type: "if",
    		source: "(195:40) ",
    		ctx
    	});

    	return block;
    }

    // (180:53) 
    function create_if_block_22$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*element*/ ctx[0].widget_name && /*$metadata*/ ctx[8].combo_values[/*element*/ ctx[0].widget_name]) return create_if_block_23$2;
    		if (!/*element*/ ctx[0].widget_name) return create_if_block_25$2;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 180, 4, 7341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_22$2.name,
    		type: "if",
    		source: "(180:53) ",
    		ctx
    	});

    	return block;
    }

    // (173:42) 
    function create_if_block_21$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let select;
    	let select_name_value;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*element*/ ctx[0].options;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$3(get_each_context_3$3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 173, 4, 6924);
    			attr_dev(select, "name", select_name_value = /*element*/ ctx[0].name);
    			attr_dev(select, "class", "dropdown svelte-1ul0qqx");
    			attr_dev(select, "readonly", /*readonly*/ ctx[4]);
    			add_location(select, file$8, 174, 8, 6984);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*change_handler_4*/ ctx[25], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, value*/ 3) {
    				each_value_3 = /*element*/ ctx[0].options;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && select_name_value !== (select_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(select, "name", select_name_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				attr_dev(select, "readonly", /*readonly*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21$2.name,
    		type: "if",
    		source: "(173:42) ",
    		ctx
    	});

    	return block;
    }

    // (163:43) 
    function create_if_block_20$2(ctx) {
    	let label0;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label0_for_value;
    	let t2;
    	let div;
    	let input;
    	let input_id_value;
    	let t3;
    	let label1;
    	let span;
    	let label1_for_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label0 = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			div = element("div");
    			input = element("input");
    			t3 = space();
    			label1 = element("label");
    			span = element("span");
    			attr_dev(label0, "for", label0_for_value = /*element*/ ctx[0].name);
    			attr_dev(label0, "class", "checkboxLabel svelte-1ul0qqx");
    			add_location(label0, file$8, 163, 8, 6414);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", input_id_value = /*element*/ ctx[0].name);
    			input.readOnly = /*readonly*/ ctx[4];
    			input.checked = /*value*/ ctx[1];
    			attr_dev(input, "class", "svelte-1ul0qqx");
    			add_location(input, file$8, 168, 8, 6664);
    			attr_dev(span, "class", "svelte-1ul0qqx");
    			add_location(span, file$8, 169, 49, 6835);
    			attr_dev(label1, "for", label1_for_value = /*element*/ ctx[0].name);
    			attr_dev(label1, "class", "toggle svelte-1ul0qqx");
    			add_location(label1, file$8, 169, 8, 6794);
    			attr_dev(div, "class", "checkbox-wrapper-3 svelte-1ul0qqx");
    			add_location(div, file$8, 167, 8, 6622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label0, anchor);
    			append_dev(label0, t0);
    			append_dev(label0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			append_dev(div, t3);
    			append_dev(div, label1);
    			append_dev(label1, span);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler_3*/ ctx[24], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label0_for_value !== (label0_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label0, "for", label0_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_id_value !== (input_id_value = /*element*/ ctx[0].name)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[4]);
    			}

    			if (dirty[0] & /*value*/ 2) {
    				prop_dev(input, "checked", /*value*/ ctx[1]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && label1_for_value !== (label1_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label1, "for", label1_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_20$2.name,
    		type: "if",
    		source: "(163:43) ",
    		ctx
    	});

    	return block;
    }

    // (160:42) 
    function create_if_block_19$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let textarea;
    	let textarea_placeholder_value;
    	let textarea_readonly_value;
    	let textarea_name_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			textarea = element("textarea");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "textarea_label svelte-1ul0qqx");
    			add_location(label, file$8, 160, 8, 6085);
    			attr_dev(textarea, "class", "textarea svelte-1ul0qqx");
    			attr_dev(textarea, "placeholder", textarea_placeholder_value = /*element*/ ctx[0].placeholder);
    			textarea.readOnly = textarea_readonly_value = /*readonly*/ ctx[4] || /*element*/ ctx[0].readonly;
    			attr_dev(textarea, "name", textarea_name_value = /*element*/ ctx[0].name);
    			textarea.value = /*value*/ ctx[1];
    			add_location(textarea, file$8, 161, 8, 6168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, textarea, anchor);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "change", /*change_handler_2*/ ctx[23], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && textarea_placeholder_value !== (textarea_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(textarea, "placeholder", textarea_placeholder_value);
    			}

    			if (dirty[0] & /*readonly, element, $metadata*/ 273 && textarea_readonly_value !== (textarea_readonly_value = /*readonly*/ ctx[4] || /*element*/ ctx[0].readonly)) {
    				prop_dev(textarea, "readOnly", textarea_readonly_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && textarea_name_value !== (textarea_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(textarea, "name", textarea_name_value);
    			}

    			if (dirty[0] & /*value*/ 2) {
    				prop_dev(textarea, "value", /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_19$2.name,
    		type: "if",
    		source: "(160:42) ",
    		ctx
    	});

    	return block;
    }

    // (158:45) 
    function create_if_block_18$2(ctx) {
    	let html_tag;
    	let raw_value = /*element*/ ctx[0].html + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && raw_value !== (raw_value = /*element*/ ctx[0].html + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18$2.name,
    		type: "if",
    		source: "(158:45) ",
    		ctx
    	});

    	return block;
    }

    // (155:4) {#if element.type === 'text'}
    function create_if_block_17$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let input;
    	let input_placeholder_value;
    	let input_readonly_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 155, 8, 5719);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "textInput svelte-1ul0qqx");
    			attr_dev(input, "placeholder", input_placeholder_value = /*element*/ ctx[0].placeholder);
    			input.readOnly = input_readonly_value = /*readonly*/ ctx[4] || /*element*/ ctx[0].readonly;
    			input.value = /*value*/ ctx[1];
    			add_location(input, file$8, 156, 8, 5779);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler_1*/ ctx[22], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_placeholder_value !== (input_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty[0] & /*readonly, element, $metadata*/ 273 && input_readonly_value !== (input_readonly_value = /*readonly*/ ctx[4] || /*element*/ ctx[0].readonly)) {
    				prop_dev(input, "readOnly", input_readonly_value);
    			}

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				prop_dev(input, "value", /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17$2.name,
    		type: "if",
    		source: "(155:4) {#if element.type === 'text'}",
    		ctx
    	});

    	return block;
    }

    // (192:8) {:else}
    function create_else_block$4(ctx) {
    	let t0;
    	let t1_value = /*element*/ ctx[0].widget_name + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text("Widget ");
    			t1 = text(t1_value);
    			t2 = text(" not found.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t1_value !== (t1_value = /*element*/ ctx[0].widget_name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(192:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (190:39) 
    function create_if_block_25$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Select Widget");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_25$2.name,
    		type: "if",
    		source: "(190:39) ",
    		ctx
    	});

    	return block;
    }

    // (182:8) {#if element.widget_name && $metadata.combo_values[element.widget_name] }
    function create_if_block_23$2(ctx) {
    	let select;
    	let select_name_value;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*$metadata*/ ctx[8].combo_values[/*element*/ ctx[0].widget_name];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4$3(get_each_context_4$3(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "name", select_name_value = /*element*/ ctx[0].name);
    			attr_dev(select, "class", "dropdown svelte-1ul0qqx");
    			attr_dev(select, "readonly", /*readonly*/ ctx[4]);
    			add_location(select, file$8, 182, 8, 7484);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*change_handler_5*/ ctx[26], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata, element, value*/ 259) {
    				each_value_4 = /*$metadata*/ ctx[8].combo_values[/*element*/ ctx[0].widget_name];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$3(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && select_name_value !== (select_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(select, "name", select_name_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				attr_dev(select, "readonly", /*readonly*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_23$2.name,
    		type: "if",
    		source: "(182:8) {#if element.widget_name && $metadata.combo_values[element.widget_name] }",
    		ctx
    	});

    	return block;
    }

    // (185:16) {#if !element.regex || new RegExp(element.regex).test(v)}
    function create_if_block_24$2(ctx) {
    	let option;
    	let t0_value = /*v*/ ctx[73] + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*v*/ ctx[73];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*value*/ ctx[1] === /*v*/ ctx[73];
    			attr_dev(option, "class", "svelte-1ul0qqx");
    			add_location(option, file$8, 185, 20, 7757);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata, element*/ 257 && t0_value !== (t0_value = /*v*/ ctx[73] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$metadata, element*/ 257 && option_value_value !== (option_value_value = /*v*/ ctx[73])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty[0] & /*value, $metadata, element*/ 259 && option_selected_value !== (option_selected_value = /*value*/ ctx[1] === /*v*/ ctx[73])) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_24$2.name,
    		type: "if",
    		source: "(185:16) {#if !element.regex || new RegExp(element.regex).test(v)}",
    		ctx
    	});

    	return block;
    }

    // (184:12) {#each $metadata.combo_values[element.widget_name] as v}
    function create_each_block_4$3(ctx) {
    	let show_if = !/*element*/ ctx[0].regex || new RegExp(/*element*/ ctx[0].regex).test(/*v*/ ctx[73]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_24$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 257) show_if = !/*element*/ ctx[0].regex || new RegExp(/*element*/ ctx[0].regex).test(/*v*/ ctx[73]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_24$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$3.name,
    		type: "each",
    		source: "(184:12) {#each $metadata.combo_values[element.widget_name] as v}",
    		ctx
    	});

    	return block;
    }

    // (176:12) {#each element.options as option}
    function create_each_block_3$3(ctx) {
    	let option;
    	let t0_value = /*option*/ ctx[64].text + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*option*/ ctx[64].value;
    			option.value = option.__value;
    			option.selected = option_selected_value = /*value*/ ctx[1] === /*option*/ ctx[64].value;
    			attr_dev(option, "class", "svelte-1ul0qqx");
    			add_location(option, file$8, 176, 16, 7156);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*option*/ ctx[64].text + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && option_value_value !== (option_value_value = /*option*/ ctx[64].value)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty[0] & /*value, element, $metadata*/ 259 && option_selected_value !== (option_selected_value = /*value*/ ctx[1] === /*option*/ ctx[64].value)) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$3.name,
    		type: "each",
    		source: "(176:12) {#each element.options as option}",
    		ctx
    	});

    	return block;
    }

    // (202:4) {#if readonly!=="readonly" && !no_edit}
    function create_if_block_16$2(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Edit";
    			attr_dev(div, "class", "editElementButton svelte-1ul0qqx");
    			add_location(div, file$8, 203, 5, 8843);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*openProperties*/ ctx[15], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16$2.name,
    		type: "if",
    		source: "(202:4) {#if readonly!==\\\"readonly\\\" && !no_edit}",
    		ctx
    	});

    	return block;
    }

    // (207:0) {#if showProperties}
    function create_if_block$8(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let div1;
    	let button0;
    	let t15;
    	let button1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*element*/ ctx[0].type !== 'layer_image' && /*element*/ ctx[0].type !== 'text_output' && /*element*/ ctx[0].type !== "advanced_options" && /*element*/ ctx[0].type !== "custom" && /*element*/ ctx[0].type !== "magnifier" && /*element*/ ctx[0].type !== "drop_layers" && create_if_block_15$2(ctx);
    	let if_block1 = (/*element*/ ctx[0].type === "slider" || /*element*/ ctx[0].type === "text" || /*element*/ ctx[0].type === "textarea" || /*element*/ ctx[0].type === "number") && create_if_block_14$3(ctx);
    	let if_block2 = /*element*/ ctx[0].type === "custom" && create_if_block_11$3(ctx);
    	let if_block3 = (/*element*/ ctx[0].type === 'text' || /*element*/ ctx[0].type === 'textarea' || /*element*/ ctx[0].type === 'number' || /*element*/ ctx[0].type === 'color_picker') && create_if_block_10$3(ctx);
    	let if_block4 = /*element*/ ctx[0].type === 'text_output' && create_if_block_9$3(ctx);
    	let if_block5 = /*element*/ ctx[0].type === 'layer_image' && create_if_block_8$3(ctx);
    	let if_block6 = /*element*/ ctx[0].type === 'drop_layers' && create_if_block_7$3(ctx);
    	let if_block7 = /*element*/ ctx[0].type === 'dropdown' && create_if_block_6$3(ctx);
    	let if_block8 = /*element*/ ctx[0].type === 'pre_filled_dropdown' && create_if_block_4$4(ctx);
    	let if_block9 = (/*element*/ ctx[0].type === 'slider' || /*element*/ ctx[0].type === 'number') && create_if_block_3$4(ctx);
    	let if_block10 = /*element*/ ctx[0].type === 'number' && create_if_block_2$6(ctx);
    	let if_block11 = /*element*/ ctx[0].type === 'slider' && create_if_block_1$6(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "X";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			if (if_block6) if_block6.c();
    			t8 = space();
    			if (if_block7) if_block7.c();
    			t9 = space();
    			if (if_block8) if_block8.c();
    			t10 = space();
    			if (if_block9) if_block9.c();
    			t11 = space();
    			if (if_block10) if_block10.c();
    			t12 = space();
    			if (if_block11) if_block11.c();
    			t13 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Delete";
    			t15 = space();
    			button1 = element("button");
    			button1.textContent = "Clone";
    			attr_dev(div0, "class", "formClose svelte-1ul0qqx");
    			add_location(div0, file$8, 209, 4, 9055);
    			attr_dev(button0, "class", "delete svelte-1ul0qqx");
    			add_location(button0, file$8, 348, 9, 16531);
    			attr_dev(button1, "class", "svelte-1ul0qqx");
    			add_location(button1, file$8, 348, 81, 16603);
    			attr_dev(div1, "class", "svelte-1ul0qqx");
    			add_location(div1, file$8, 348, 4, 16526);
    			attr_dev(div2, "class", "element-properties svelte-1ul0qqx");
    			add_location(div2, file$8, 207, 0, 8954);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t4);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t5);
    			if (if_block4) if_block4.m(div2, null);
    			append_dev(div2, t6);
    			if (if_block5) if_block5.m(div2, null);
    			append_dev(div2, t7);
    			if (if_block6) if_block6.m(div2, null);
    			append_dev(div2, t8);
    			if (if_block7) if_block7.m(div2, null);
    			append_dev(div2, t9);
    			if (if_block8) if_block8.m(div2, null);
    			append_dev(div2, t10);
    			if (if_block9) if_block9.m(div2, null);
    			append_dev(div2, t11);
    			if (if_block10) if_block10.m(div2, null);
    			append_dev(div2, t12);
    			if (if_block11) if_block11.m(div2, null);
    			append_dev(div2, t13);
    			append_dev(div2, div1);
    			append_dev(div1, button0);
    			append_dev(div1, t15);
    			append_dev(div1, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*closeProperties*/ ctx[16], false, false, false, false),
    					listen_dev(button0, "click", /*click_handler_4*/ ctx[57], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_5*/ ctx[58], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*element*/ ctx[0].type !== 'layer_image' && /*element*/ ctx[0].type !== 'text_output' && /*element*/ ctx[0].type !== "advanced_options" && /*element*/ ctx[0].type !== "custom" && /*element*/ ctx[0].type !== "magnifier" && /*element*/ ctx[0].type !== "drop_layers") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_15$2(ctx);
    					if_block0.c();
    					if_block0.m(div2, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*element*/ ctx[0].type === "slider" || /*element*/ ctx[0].type === "text" || /*element*/ ctx[0].type === "textarea" || /*element*/ ctx[0].type === "number") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_14$3(ctx);
    					if_block1.c();
    					if_block1.m(div2, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*element*/ ctx[0].type === "custom") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_11$3(ctx);
    					if_block2.c();
    					if_block2.m(div2, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*element*/ ctx[0].type === 'text' || /*element*/ ctx[0].type === 'textarea' || /*element*/ ctx[0].type === 'number' || /*element*/ ctx[0].type === 'color_picker') {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_10$3(ctx);
    					if_block3.c();
    					if_block3.m(div2, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*element*/ ctx[0].type === 'text_output') {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_9$3(ctx);
    					if_block4.c();
    					if_block4.m(div2, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*element*/ ctx[0].type === 'layer_image') {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_8$3(ctx);
    					if_block5.c();
    					if_block5.m(div2, t7);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*element*/ ctx[0].type === 'drop_layers') {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_7$3(ctx);
    					if_block6.c();
    					if_block6.m(div2, t8);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*element*/ ctx[0].type === 'dropdown') {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_6$3(ctx);
    					if_block7.c();
    					if_block7.m(div2, t9);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*element*/ ctx[0].type === 'pre_filled_dropdown') {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_4$4(ctx);
    					if_block8.c();
    					if_block8.m(div2, t10);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*element*/ ctx[0].type === 'slider' || /*element*/ ctx[0].type === 'number') {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_3$4(ctx);
    					if_block9.c();
    					if_block9.m(div2, t11);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*element*/ ctx[0].type === 'number') {
    				if (if_block10) {
    					if_block10.p(ctx, dirty);
    				} else {
    					if_block10 = create_if_block_2$6(ctx);
    					if_block10.c();
    					if_block10.m(div2, t12);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (/*element*/ ctx[0].type === 'slider') {
    				if (if_block11) {
    					if_block11.p(ctx, dirty);
    				} else {
    					if_block11 = create_if_block_1$6(ctx);
    					if_block11.c();
    					if_block11.m(div2, t13);
    				}
    			} else if (if_block11) {
    				if_block11.d(1);
    				if_block11 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			if (if_block11) if_block11.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(207:0) {#if showProperties}",
    		ctx
    	});

    	return block;
    }

    // (211:4) {#if element.type !== 'layer_image' &&   element.type !== 'text_output' && element.type!=="advanced_options"  && element.type!=="custom" && element.type!=="magnifier" && element.type!=="drop_layers"}
    function create_if_block_15$2(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let input1_value_value;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let input2;
    	let input2_value_value;
    	let t8;
    	let div3;
    	let label3;
    	let t10;
    	let input3;
    	let t11;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Label:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Name:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Default value:";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "Hidden:";
    			t10 = space();
    			input3 = element("input");
    			t11 = text(" Hide Input in form");
    			attr_dev(label0, "for", "label");
    			attr_dev(label0, "class", "svelte-1ul0qqx");
    			add_location(label0, file$8, 212, 12, 9365);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "label");
    			input0.value = input0_value_value = /*element*/ ctx[0].label;
    			attr_dev(input0, "class", "svelte-1ul0qqx");
    			add_location(input0, file$8, 213, 12, 9412);
    			attr_dev(div0, "class", "formLine svelte-1ul0qqx");
    			add_location(div0, file$8, 211, 8, 9328);
    			attr_dev(label1, "for", "name");
    			attr_dev(label1, "class", "svelte-1ul0qqx");
    			add_location(label1, file$8, 216, 12, 9589);
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*element*/ ctx[0].name;
    			attr_dev(input1, "class", "svelte-1ul0qqx");
    			add_location(input1, file$8, 217, 8, 9633);
    			attr_dev(div1, "class", "formLine svelte-1ul0qqx");
    			add_location(div1, file$8, 215, 8, 9553);
    			attr_dev(label2, "for", "default");
    			attr_dev(label2, "class", "svelte-1ul0qqx");
    			add_location(label2, file$8, 220, 12, 9798);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "default");
    			input2.value = input2_value_value = /*element*/ ctx[0].default;
    			attr_dev(input2, "class", "svelte-1ul0qqx");
    			add_location(input2, file$8, 221, 8, 9854);
    			attr_dev(div2, "class", "formLine svelte-1ul0qqx");
    			add_location(div2, file$8, 219, 8, 9762);
    			attr_dev(label3, "for", "hidden");
    			attr_dev(label3, "class", "svelte-1ul0qqx");
    			add_location(label3, file$8, 224, 12, 10041);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "name", "hidden");
    			attr_dev(input3, "class", "svelte-1ul0qqx");
    			add_location(input3, file$8, 225, 12, 10092);
    			attr_dev(div3, "class", "formLine svelte-1ul0qqx");
    			add_location(div3, file$8, 223, 8, 10005);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, label3);
    			append_dev(div3, t10);
    			append_dev(div3, input3);
    			input3.checked = /*element*/ ctx[0].hidden;
    			append_dev(div3, t11);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input_handler*/ ctx[30], false, false, false, false),
    					listen_dev(input1, "change", /*change_handler_8*/ ctx[31], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_1*/ ctx[32], false, false, false, false),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[33])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 257 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].label) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].name) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].default) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257) {
    				input3.checked = /*element*/ ctx[0].hidden;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15$2.name,
    		type: "if",
    		source: "(211:4) {#if element.type !== 'layer_image' &&   element.type !== 'text_output' && element.type!==\\\"advanced_options\\\"  && element.type!==\\\"custom\\\" && element.type!==\\\"magnifier\\\" && element.type!==\\\"drop_layers\\\"}",
    		ctx
    	});

    	return block;
    }

    // (229:4) {#if element.type==="slider" || element.type==="text" || element.type==="textarea" || element.type==="number"}
    function create_if_block_14$3(ctx) {
    	let div;
    	let label;
    	let t1;
    	let input;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Hidden:";
    			t1 = space();
    			input = element("input");
    			t2 = text(" Readonly");
    			attr_dev(label, "for", "hidden");
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 230, 8, 10369);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "hidden");
    			attr_dev(input, "class", "svelte-1ul0qqx");
    			add_location(input, file$8, 231, 8, 10416);
    			attr_dev(div, "class", "formLine svelte-1ul0qqx");
    			add_location(div, file$8, 229, 4, 10337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, input);
    			input.checked = /*element*/ ctx[0].readonly;
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[34]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 257) {
    				input.checked = /*element*/ ctx[0].readonly;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14$3.name,
    		type: "if",
    		source: "(229:4) {#if element.type===\\\"slider\\\" || element.type===\\\"text\\\" || element.type===\\\"textarea\\\" || element.type===\\\"number\\\"}",
    		ctx
    	});

    	return block;
    }

    // (235:4) {#if element.type==="custom"}
    function create_if_block_11$3(ctx) {
    	let t0;
    	let div;
    	let label;
    	let t2;
    	let input;
    	let t3;
    	let mounted;
    	let dispose;
    	let each_value_2 = Object.entries(/*element*/ ctx[0].parameters);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$3(get_each_context_2$3(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div = element("div");
    			label = element("label");
    			label.textContent = "Hidden:";
    			t2 = space();
    			input = element("input");
    			t3 = text(" Hide Input in form");
    			attr_dev(label, "for", "hidden");
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 255, 12, 11519);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "hidden");
    			attr_dev(input, "class", "svelte-1ul0qqx");
    			add_location(input, file$8, 256, 12, 11570);
    			attr_dev(div, "class", "formLine svelte-1ul0qqx");
    			add_location(div, file$8, 254, 10, 11483);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t2);
    			append_dev(div, input);
    			input.checked = /*element*/ ctx[0].hidden;
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[37]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, updateElement*/ 2049) {
    				each_value_2 = Object.entries(/*element*/ ctx[0].parameters);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$3(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty[0] & /*element, $metadata*/ 257) {
    				input.checked = /*element*/ ctx[0].hidden;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$3.name,
    		type: "if",
    		source: "(235:4) {#if element.type===\\\"custom\\\"}",
    		ctx
    	});

    	return block;
    }

    // (239:16) {#if p.type==="text"}
    function create_if_block_13$3(ctx) {
    	let label;
    	let t0_value = /*p*/ ctx[68].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let input;
    	let input_name_value;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	function change_handler_9(...args) {
    		return /*change_handler_9*/ ctx[35](/*name*/ ctx[67], ...args);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*name*/ ctx[67]);
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 239, 20, 10743);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", input_name_value = /*name*/ ctx[67]);
    			input.value = input_value_value = /*element*/ ctx[0][/*name*/ ctx[67]];
    			attr_dev(input, "class", "svelte-1ul0qqx");
    			add_location(input, file$8, 240, 20, 10805);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler_9, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*p*/ ctx[68].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*name*/ ctx[67])) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_name_value !== (input_name_value = /*name*/ ctx[67])) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_value_value !== (input_value_value = /*element*/ ctx[0][/*name*/ ctx[67]]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13$3.name,
    		type: "if",
    		source: "(239:16) {#if p.type===\\\"text\\\"}",
    		ctx
    	});

    	return block;
    }

    // (246:16) {#if p.type==="textarea"}
    function create_if_block_12$3(ctx) {
    	let label;
    	let t0_value = /*p*/ ctx[68].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let textarea;
    	let textarea_name_value;
    	let textarea_value_value;
    	let mounted;
    	let dispose;

    	function change_handler_10(...args) {
    		return /*change_handler_10*/ ctx[36](/*name*/ ctx[67], ...args);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			textarea = element("textarea");
    			attr_dev(label, "for", label_for_value = /*name*/ ctx[67]);
    			attr_dev(label, "class", "textarea_label svelte-1ul0qqx");
    			add_location(label, file$8, 246, 20, 11095);
    			attr_dev(textarea, "class", "textarea svelte-1ul0qqx");
    			attr_dev(textarea, "name", textarea_name_value = /*name*/ ctx[67]);
    			textarea.value = textarea_value_value = /*element*/ ctx[0][/*name*/ ctx[67]];
    			add_location(textarea, file$8, 247, 20, 11180);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, textarea, anchor);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "change", change_handler_10, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*p*/ ctx[68].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 257 && label_for_value !== (label_for_value = /*name*/ ctx[67])) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && textarea_name_value !== (textarea_name_value = /*name*/ ctx[67])) {
    				attr_dev(textarea, "name", textarea_name_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && textarea_value_value !== (textarea_value_value = /*element*/ ctx[0][/*name*/ ctx[67]])) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$3.name,
    		type: "if",
    		source: "(246:16) {#if p.type===\\\"textarea\\\"}",
    		ctx
    	});

    	return block;
    }

    // (236:12) {#each Object.entries(element.parameters) as [name, p]}
    function create_each_block_2$3(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*p*/ ctx[68].type === "text" && create_if_block_13$3(ctx);
    	let if_block1 = /*p*/ ctx[68].type === "textarea" && create_if_block_12$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "formLine svelte-1ul0qqx");
    			add_location(div, file$8, 236, 12, 10642);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*p*/ ctx[68].type === "text") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_13$3(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*p*/ ctx[68].type === "textarea") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_12$3(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$3.name,
    		type: "each",
    		source: "(236:12) {#each Object.entries(element.parameters) as [name, p]}",
    		ctx
    	});

    	return block;
    }

    // (260:4) {#if element.type === 'text' || element.type === 'textarea' || element.type === 'number'  || element.type === 'color_picker'}
    function create_if_block_10$3(ctx) {
    	let div;
    	let label;
    	let t1;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Placeholder:";
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "for", "placeholder");
    			attr_dev(label, "class", "svelte-1ul0qqx");
    			add_location(label, file$8, 261, 12, 11879);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "placeholder");
    			input.value = input_value_value = /*element*/ ctx[0].placeholder;
    			attr_dev(input, "class", "svelte-1ul0qqx");
    			add_location(input, file$8, 262, 8, 11937);
    			attr_dev(div, "class", "formLine svelte-1ul0qqx");
    			add_location(div, file$8, 260, 8, 11843);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler_2*/ ctx[38], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 257 && input_value_value !== (input_value_value = /*element*/ ctx[0].placeholder) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$3.name,
    		type: "if",
    		source: "(260:4) {#if element.type === 'text' || element.type === 'textarea' || element.type === 'number'  || element.type === 'color_picker'}",
    		ctx
    	});

    	return block;
    }

    // (266:4) {#if element.type === 'text_output'}
    function create_if_block_9$3(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input;
    	let input_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let textarea;
    	let textarea_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "HTML/Text:";
    			t4 = space();
    			textarea = element("textarea");
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-1ul0qqx");
    			add_location(label0, file$8, 267, 12, 12187);
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*element*/ ctx[0].name;
    			attr_dev(input, "class", "svelte-1ul0qqx");
    			add_location(input, file$8, 268, 8, 12231);
    			attr_dev(div0, "class", "formLine svelte-1ul0qqx");
    			add_location(div0, file$8, 266, 8, 12151);
    			attr_dev(label1, "for", "html");
    			attr_dev(label1, "class", "svelte-1ul0qqx");
    			add_location(label1, file$8, 271, 12, 12400);
    			attr_dev(textarea, "name", "html");
    			textarea.value = textarea_value_value = /*element*/ ctx[0].html;
    			attr_dev(textarea, "class", "svelte-1ul0qqx");
    			add_location(textarea, file$8, 272, 12, 12453);
    			attr_dev(div1, "class", "formLine svelte-1ul0qqx");
    			add_location(div1, file$8, 270, 8, 12364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, textarea);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler_11*/ ctx[39], false, false, false, false),
    					listen_dev(textarea, "input", /*input_handler_3*/ ctx[40], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 257 && input_value_value !== (input_value_value = /*element*/ ctx[0].name) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && textarea_value_value !== (textarea_value_value = /*element*/ ctx[0].html)) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$3.name,
    		type: "if",
    		source: "(266:4) {#if element.type === 'text_output'}",
    		ctx
    	});

    	return block;
    }

    // (276:4) {#if element.type === 'layer_image' }
    function create_if_block_8$3(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Pixel Data:";
    			t4 = space();
    			input1 = element("input");
    			t5 = text(" From Selection");
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-1ul0qqx");
    			add_location(label0, file$8, 277, 12, 12679);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			input0.value = input0_value_value = /*element*/ ctx[0].name;
    			attr_dev(input0, "class", "svelte-1ul0qqx");
    			add_location(input0, file$8, 278, 12, 12727);
    			attr_dev(div0, "class", "formLine svelte-1ul0qqx");
    			add_location(div0, file$8, 276, 8, 12643);
    			attr_dev(label1, "for", "from_selection");
    			attr_dev(label1, "class", "svelte-1ul0qqx");
    			add_location(label1, file$8, 281, 12, 12902);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "name", "from_selection");
    			attr_dev(input1, "class", "svelte-1ul0qqx");
    			add_location(input1, file$8, 282, 12, 12965);
    			attr_dev(div1, "class", "formLine svelte-1ul0qqx");
    			add_location(div1, file$8, 280, 8, 12866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			input1.checked = /*element*/ ctx[0].from_selection;
    			append_dev(div1, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler_12*/ ctx[41], false, false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[42])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 257 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].name) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257) {
    				input1.checked = /*element*/ ctx[0].from_selection;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$3.name,
    		type: "if",
    		source: "(276:4) {#if element.type === 'layer_image' }",
    		ctx
    	});

    	return block;
    }

    // (286:4) {#if element.type === 'drop_layers' }
    function create_if_block_7$3(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let input1_value_value;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let input2;
    	let input2_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Label:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Number:";
    			t7 = space();
    			input2 = element("input");
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-1ul0qqx");
    			add_location(label0, file$8, 287, 12, 13188);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			input0.value = input0_value_value = /*element*/ ctx[0].name;
    			attr_dev(input0, "class", "svelte-1ul0qqx");
    			add_location(input0, file$8, 288, 12, 13236);
    			attr_dev(div0, "class", "formLine svelte-1ul0qqx");
    			add_location(div0, file$8, 286, 8, 13152);
    			attr_dev(label1, "for", "name");
    			attr_dev(label1, "class", "svelte-1ul0qqx");
    			add_location(label1, file$8, 291, 12, 13411);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "name");
    			input1.value = input1_value_value = /*element*/ ctx[0].label;
    			attr_dev(input1, "class", "svelte-1ul0qqx");
    			add_location(input1, file$8, 292, 12, 13460);
    			attr_dev(div1, "class", "formLine svelte-1ul0qqx");
    			add_location(div1, file$8, 290, 8, 13375);
    			attr_dev(label2, "for", "name");
    			attr_dev(label2, "class", "svelte-1ul0qqx");
    			add_location(label2, file$8, 295, 12, 13641);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "name");
    			input2.value = input2_value_value = /*element*/ ctx[0].num_layers;
    			attr_dev(input2, "class", "svelte-1ul0qqx");
    			add_location(input2, file$8, 296, 12, 13691);
    			attr_dev(div2, "class", "formLine svelte-1ul0qqx");
    			add_location(div2, file$8, 294, 8, 13605);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler_13*/ ctx[43], false, false, false, false),
    					listen_dev(input1, "change", /*change_handler_14*/ ctx[44], false, false, false, false),
    					listen_dev(input2, "change", /*change_handler_15*/ ctx[45], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 257 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].name) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].label) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].num_layers) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$3.name,
    		type: "if",
    		source: "(286:4) {#if element.type === 'drop_layers' }",
    		ctx
    	});

    	return block;
    }

    // (300:4) {#if element.type === 'dropdown'}
    function create_if_block_6$3(ctx) {
    	let t0;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*element*/ ctx[0].options;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$5(get_each_context_1$5(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			button = element("button");
    			button.textContent = "Add Option";
    			attr_dev(button, "class", "svelte-1ul0qqx");
    			add_location(button, file$8, 309, 8, 14515);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addOption*/ ctx[13], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*removeOption, element, handleOptionChange*/ 20481) {
    				each_value_1 = /*element*/ ctx[0].options;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$5(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$3.name,
    		type: "if",
    		source: "(300:4) {#if element.type === 'dropdown'}",
    		ctx
    	});

    	return block;
    }

    // (301:8) {#each element.options as option, index}
    function create_each_block_1$5(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let input1_value_value;
    	let t5;
    	let button;
    	let mounted;
    	let dispose;

    	function input_handler_4(...args) {
    		return /*input_handler_4*/ ctx[46](/*index*/ ctx[66], ...args);
    	}

    	function input_handler_5(...args) {
    		return /*input_handler_5*/ ctx[47](/*index*/ ctx[66], ...args);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[48](/*index*/ ctx[66]);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Option Text:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Option Value:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			button = element("button");
    			button.textContent = "Remove Option";
    			attr_dev(label0, "for", "text");
    			attr_dev(label0, "class", "svelte-1ul0qqx");
    			add_location(label0, file$8, 302, 16, 14012);
    			attr_dev(input0, "name", "text");
    			attr_dev(input0, "type", "text");
    			input0.value = input0_value_value = /*option*/ ctx[64].text;
    			attr_dev(input0, "class", "svelte-1ul0qqx");
    			add_location(input0, file$8, 302, 55, 14051);
    			attr_dev(div0, "class", "formLine svelte-1ul0qqx");
    			add_location(div0, file$8, 301, 12, 13972);
    			attr_dev(label1, "for", "key");
    			attr_dev(label1, "class", "svelte-1ul0qqx");
    			add_location(label1, file$8, 305, 16, 14233);
    			attr_dev(input1, "name", "value");
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*option*/ ctx[64].value;
    			attr_dev(input1, "class", "svelte-1ul0qqx");
    			add_location(input1, file$8, 305, 55, 14272);
    			attr_dev(button, "class", "svelte-1ul0qqx");
    			add_location(button, file$8, 306, 16, 14401);
    			attr_dev(div1, "class", "formLine svelte-1ul0qqx");
    			add_location(div1, file$8, 304, 12, 14193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			append_dev(div1, t5);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", input_handler_4, false, false, false, false),
    					listen_dev(input1, "input", input_handler_5, false, false, false, false),
    					listen_dev(button, "click", click_handler_1, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*element, $metadata*/ 257 && input0_value_value !== (input0_value_value = /*option*/ ctx[64].text) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input1_value_value !== (input1_value_value = /*option*/ ctx[64].value) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$5.name,
    		type: "each",
    		source: "(301:8) {#each element.options as option, index}",
    		ctx
    	});

    	return block;
    }

    // (312:4) {#if element.type === 'pre_filled_dropdown'}
    function create_if_block_4$4(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let select;
    	let option;
    	let t3;
    	let div1;
    	let label1;
    	let t5;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;
    	let if_block = /*$metadata*/ ctx[8].combo_values && create_if_block_5$3(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Combo Widget:";
    			t1 = space();
    			select = element("select");
    			option = element("option");
    			option.textContent = "Select...";
    			if (if_block) if_block.c();
    			t3 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Filter RegEx:";
    			t5 = space();
    			input = element("input");
    			attr_dev(label0, "for", "widget_name");
    			attr_dev(label0, "class", "svelte-1ul0qqx");
    			add_location(label0, file$8, 313, 12, 14670);
    			option.__value = "Select...";
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-1ul0qqx");
    			add_location(option, file$8, 315, 16, 14881);
    			attr_dev(select, "name", "widget_name");
    			attr_dev(select, "class", "svelte-1ul0qqx");
    			if (/*element*/ ctx[0].widget_name === void 0) add_render_callback(() => /*select_change_handler*/ ctx[50].call(select));
    			add_location(select, file$8, 314, 12, 14733);
    			attr_dev(div0, "class", "formLine svelte-1ul0qqx");
    			add_location(div0, file$8, 312, 8, 14634);
    			attr_dev(label1, "for", "rexex");
    			attr_dev(label1, "class", "svelte-1ul0qqx");
    			add_location(label1, file$8, 324, 12, 15258);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "regex");
    			input.value = input_value_value = getParameterValue(/*element*/ ctx[0].regex, "");
    			attr_dev(input, "class", "svelte-1ul0qqx");
    			add_location(input, file$8, 325, 12, 15315);
    			attr_dev(div1, "class", "formLine svelte-1ul0qqx");
    			add_location(div1, file$8, 323, 8, 15222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, select);
    			append_dev(select, option);
    			if (if_block) if_block.m(select, null);
    			select_option(select, /*element*/ ctx[0].widget_name, true);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t5);
    			append_dev(div1, input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*change_handler_16*/ ctx[49], false, false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[50]),
    					listen_dev(input, "change", /*change_handler_17*/ ctx[51], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*$metadata*/ ctx[8].combo_values) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$3(ctx);
    					if_block.c();
    					if_block.m(select, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*element, $metadata*/ 257) {
    				select_option(select, /*element*/ ctx[0].widget_name);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input_value_value !== (input_value_value = getParameterValue(/*element*/ ctx[0].regex, "")) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$4.name,
    		type: "if",
    		source: "(312:4) {#if element.type === 'pre_filled_dropdown'}",
    		ctx
    	});

    	return block;
    }

    // (317:16) {#if $metadata.combo_values}
    function create_if_block_5$3(ctx) {
    	let each_1_anchor;
    	let each_value = Object.entries(/*$metadata*/ ctx[8].combo_values);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
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
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 256) {
    				each_value = Object.entries(/*$metadata*/ ctx[8].combo_values);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
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
    		id: create_if_block_5$3.name,
    		type: "if",
    		source: "(317:16) {#if $metadata.combo_values}",
    		ctx
    	});

    	return block;
    }

    // (318:20) {#each Object.entries($metadata.combo_values) as [widget_name,values]}
    function create_each_block$7(ctx) {
    	let option;
    	let t_value = /*widget_name*/ ctx[60] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*widget_name*/ ctx[60];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-1ul0qqx");
    			add_location(option, file$8, 318, 24, 15071);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 256 && t_value !== (t_value = /*widget_name*/ ctx[60] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*$metadata*/ 256 && option_value_value !== (option_value_value = /*widget_name*/ ctx[60])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(318:20) {#each Object.entries($metadata.combo_values) as [widget_name,values]}",
    		ctx
    	});

    	return block;
    }

    // (329:4) {#if element.type === 'slider' || element.type === 'number'}
    function create_if_block_3$4(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let input1_value_value;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let input2;
    	let input2_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Min:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Max:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Step:";
    			t7 = space();
    			input2 = element("input");
    			attr_dev(label0, "for", "min");
    			attr_dev(label0, "class", "svelte-1ul0qqx");
    			add_location(label0, file$8, 330, 12, 15604);
    			attr_dev(input0, "name", "min");
    			attr_dev(input0, "type", "number");
    			input0.value = input0_value_value = /*element*/ ctx[0].min;
    			attr_dev(input0, "class", "svelte-1ul0qqx");
    			add_location(input0, file$8, 331, 12, 15649);
    			attr_dev(div0, "class", "formLine svelte-1ul0qqx");
    			add_location(div0, file$8, 329, 8, 15568);
    			attr_dev(label1, "for", "max");
    			attr_dev(label1, "class", "svelte-1ul0qqx");
    			add_location(label1, file$8, 334, 12, 15824);
    			attr_dev(input1, "name", "max");
    			attr_dev(input1, "type", "number");
    			input1.value = input1_value_value = /*element*/ ctx[0].max;
    			attr_dev(input1, "class", "svelte-1ul0qqx");
    			add_location(input1, file$8, 335, 12, 15869);
    			attr_dev(div1, "class", "formLine svelte-1ul0qqx");
    			add_location(div1, file$8, 333, 8, 15788);
    			attr_dev(label2, "for", "step");
    			attr_dev(label2, "class", "svelte-1ul0qqx");
    			add_location(label2, file$8, 338, 12, 16043);
    			attr_dev(input2, "name", "step");
    			attr_dev(input2, "type", "number");
    			input2.value = input2_value_value = /*element*/ ctx[0].step;
    			attr_dev(input2, "class", "svelte-1ul0qqx");
    			add_location(input2, file$8, 339, 12, 16090);
    			attr_dev(div2, "class", "formLine svelte-1ul0qqx");
    			add_location(div2, file$8, 337, 8, 16007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input_handler_6*/ ctx[52], false, false, false, false),
    					listen_dev(input1, "input", /*input_handler_7*/ ctx[53], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_8*/ ctx[54], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 257 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].min) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].max) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 257 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].step) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(329:4) {#if element.type === 'slider' || element.type === 'number'}",
    		ctx
    	});

    	return block;
    }

    // (343:4) {#if element.type === 'number'}
    function create_if_block_2$6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Convert to Slider";
    			attr_dev(button, "class", "svelte-1ul0qqx");
    			add_location(button, file$8, 343, 7, 16276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[55], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(343:4) {#if element.type === 'number'}",
    		ctx
    	});

    	return block;
    }

    // (346:4) {#if element.type === 'slider'}
    function create_if_block_1$6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Convert to Number";
    			attr_dev(button, "class", "svelte-1ul0qqx");
    			add_location(button, file$8, 346, 7, 16421);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[56], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(346:4) {#if element.type === 'slider'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let if_block9_anchor;
    	let current;
    	let if_block0 = /*element*/ ctx[0].type === "custom" && create_if_block_34$1(ctx);
    	let if_block1 = /*element*/ ctx[0].type === "advanced_options" && create_if_block_33$1(ctx);
    	let if_block2 = /*element*/ ctx[0].type === "layer_image" && create_if_block_32$1(ctx);
    	let if_block3 = /*element*/ ctx[0].type === "magnifier" && create_if_block_31$1(ctx);
    	let if_block4 = /*element*/ ctx[0].type === "drop_layers" && create_if_block_30$2(ctx);
    	let if_block5 = /*element*/ ctx[0].type === "layer_image_ids" && create_if_block_29$2(ctx);
    	let if_block6 = /*element*/ ctx[0].type === 'color_picker' && create_if_block_28$2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*element*/ ctx[0].type === 'text') return create_if_block_17$2;
    		if (/*element*/ ctx[0].type === 'text_output') return create_if_block_18$2;
    		if (/*element*/ ctx[0].type === 'textarea') return create_if_block_19$2;
    		if (/*element*/ ctx[0].type === 'checkbox') return create_if_block_20$2;
    		if (/*element*/ ctx[0].type === 'dropdown') return create_if_block_21$2;
    		if (/*element*/ ctx[0].type === 'pre_filled_dropdown') return create_if_block_22$2;
    		if (/*element*/ ctx[0].type === 'slider') return create_if_block_26$2;
    		if (/*element*/ ctx[0].type === 'number') return create_if_block_27$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block7 = current_block_type && current_block_type(ctx);
    	let if_block8 = /*readonly*/ ctx[4] !== "readonly" && !/*no_edit*/ ctx[5] && create_if_block_16$2(ctx);
    	let if_block9 = /*showProperties*/ ctx[3] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			t7 = space();
    			if (if_block8) if_block8.c();
    			t8 = space();
    			if (if_block9) if_block9.c();
    			if_block9_anchor = empty();
    			attr_dev(div, "class", "element-preview svelte-1ul0qqx");
    			toggle_class(div, "showHidden", /*element*/ ctx[0].hidden && !/*element*/ ctx[0].showIt || /*element*/ ctx[0].hideIt);
    			add_location(div, file$8, 114, 0, 3803);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t3);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t4);
    			if (if_block5) if_block5.m(div, null);
    			append_dev(div, t5);
    			if (if_block6) if_block6.m(div, null);
    			append_dev(div, t6);
    			if (if_block7) if_block7.m(div, null);
    			append_dev(div, t7);
    			if (if_block8) if_block8.m(div, null);
    			/*div_binding*/ ctx[29](div);
    			insert_dev(target, t8, anchor);
    			if (if_block9) if_block9.m(target, anchor);
    			insert_dev(target, if_block9_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*element*/ ctx[0].type === "custom") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_34$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*element*/ ctx[0].type === "advanced_options") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_33$1(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*element*/ ctx[0].type === "layer_image") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_32$1(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*element*/ ctx[0].type === "magnifier") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_31$1(ctx);
    					if_block3.c();
    					if_block3.m(div, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*element*/ ctx[0].type === "drop_layers") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*element*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_30$2(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*element*/ ctx[0].type === "layer_image_ids") {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty[0] & /*element*/ 1) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_29$2(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div, t5);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (/*element*/ ctx[0].type === 'color_picker') {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_28$2(ctx);
    					if_block6.c();
    					if_block6.m(div, t6);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block7) {
    				if_block7.p(ctx, dirty);
    			} else {
    				if (if_block7) if_block7.d(1);
    				if_block7 = current_block_type && current_block_type(ctx);

    				if (if_block7) {
    					if_block7.c();
    					if_block7.m(div, t7);
    				}
    			}

    			if (/*readonly*/ ctx[4] !== "readonly" && !/*no_edit*/ ctx[5]) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_16$2(ctx);
    					if_block8.c();
    					if_block8.m(div, null);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (!current || dirty[0] & /*element*/ 1) {
    				toggle_class(div, "showHidden", /*element*/ ctx[0].hidden && !/*element*/ ctx[0].showIt || /*element*/ ctx[0].hideIt);
    			}

    			if (/*showProperties*/ ctx[3]) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block$8(ctx);
    					if_block9.c();
    					if_block9.m(if_block9_anchor.parentNode, if_block9_anchor);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block4);
    			transition_in(if_block5);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block4);
    			transition_out(if_block5);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();

    			if (if_block7) {
    				if_block7.d();
    			}

    			if (if_block8) if_block8.d();
    			/*div_binding*/ ctx[29](null);
    			if (detaching) detach_dev(t8);
    			if (if_block9) if_block9.d(detaching);
    			if (detaching) detach_dev(if_block9_anchor);
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

    function getParameterValue(value, defaultValue) {
    	if (!value) return defaultValue;
    	return value;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(8, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormElement', slots, []);
    	let { element } = $$props;
    	let { showProperties = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let { value } = $$props;
    	let { readonly = "" } = $$props;
    	let { no_edit = false } = $$props;
    	let layers = [];

    	if (element.type === "slider") {
    		if (!value) value = element.min;
    	}

    	// Function to immediately update the parent component
    	function updateElement(updatedProps) {
    		$$invalidate(0, element = { ...element, ...updatedProps });

    		if (element.type === "slider" || element.type === "number") {
    			$$invalidate(1, value = element.default);
    			$$invalidate(0, element.min = parseFloat(element.min), element);
    			$$invalidate(0, element.max = parseFloat(element.max), element);
    			if (!element.default) $$invalidate(0, element.default = 0, element);
    			$$invalidate(0, element.default = parseFloat(element.default), element);
    		}

    		if (element.type === "custom") generateElement();
    		dispatch('update', element);
    	}

    	// Function to handle option updates for dropdowns
    	function handleOptionChange(event, index, key) {
    		const updatedOptions = [...element.options];
    		updatedOptions[index][key] = event.target.value;
    		updateElement({ options: updatedOptions });
    	}

    	// Add a new option to the dropdown
    	function addOption() {
    		updateElement({
    			options: [...element.options, { text: '', key: '' }]
    		});
    	}

    	// Remove an option from the dropdown
    	function removeOption(index) {
    		const updatedOptions = element.options.filter((_, i) => i !== index);
    		updateElement({ options: updatedOptions });
    	}

    	function openProperties() {
    		dispatch('openProperties', {});
    	}

    	function closeProperties() {
    		dispatch('closeProperties', {});
    	}

    	function deleteElement() {
    		dispatch("delete", {});
    	}

    	function cloneElement() {
    		dispatch("clone", element);
    	}

    	function changeValue(newValue) {
    		$$invalidate(1, value = newValue);
    		dispatch("change", { value });
    	}

    	let html;

    	/**
     * for custom elements
     */
    	function generateElement() {
    		// not using <svelte:element because we need custom parameters
    		$$invalidate(6, html = "<" + element.tag + " class=\"custom\" value=\"" + value + "\" ");

    		for (let name in element.parameters) {
    			// add more parameters
    			if (name !== "label" && name !== "name" && name !== "default" && name !== "value") {
    				$$invalidate(6, html += name + "=\"" + element[name] + "\" ");
    			}
    		}

    		$$invalidate(6, html += "></" + element.tag + ">");
    	}

    	onMount(() => {
    		// get all combo values
    		if (!$metadata.combo_values) set_store_value(metadata, $metadata.combo_values = {}, $metadata);

    		let mh = new mappingsHelper();
    		mh.setComboValues($metadata.combo_values);
    		generateElement();
    		if (!elementRoot) return;
    		let customElements = elementRoot.getElementsByClassName("custom"); // should be max 1
    		if (!customElements) return;

    		for (let i = 0; i < customElements.length; i++) {
    			// for not really needed here
    			let element = customElements[i];

    			element.addEventListener("change", e => changeValue(e.target.value));
    		}
    	});

    	let { advancedOptions = true } = $$props;
    	let elementRoot;

    	$$self.$$.on_mount.push(function () {
    		if (element === undefined && !('element' in $$props || $$self.$$.bound[$$self.$$.props['element']])) {
    			console.warn("<FormElement> was created without expected prop 'element'");
    		}

    		if (value === undefined && !('value' in $$props || $$self.$$.bound[$$self.$$.props['value']])) {
    			console.warn("<FormElement> was created without expected prop 'value'");
    		}
    	});

    	const writable_props = ['element', 'showProperties', 'value', 'readonly', 'no_edit', 'advancedOptions'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormElement> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		$$invalidate(2, advancedOptions = !advancedOptions);
    		dispatch("redrawAll", {});
    	};

    	const change_handler = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_1 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_2 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_3 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_4 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_5 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_6 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_7 = e => {
    		changeValue(e.target.value);
    	};

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			elementRoot = $$value;
    			$$invalidate(7, elementRoot);
    		});
    	}

    	const input_handler = e => updateElement({ label: e.target.value });
    	const change_handler_8 = e => updateElement({ name: e.target.value });
    	const input_handler_1 = e => updateElement({ default: e.target.value });

    	function input3_change_handler() {
    		element.hidden = this.checked;
    		$$invalidate(0, element);
    	}

    	function input_change_handler() {
    		element.readonly = this.checked;
    		$$invalidate(0, element);
    	}

    	const change_handler_9 = (name, e) => {
    		let obj = {};
    		obj[name] = e.target.value;
    		updateElement(obj);
    	};

    	const change_handler_10 = (name, e) => {
    		let obj = {};
    		obj[name] = e.target.value;
    		updateElement(obj);
    	};

    	function input_change_handler_1() {
    		element.hidden = this.checked;
    		$$invalidate(0, element);
    	}

    	const input_handler_2 = e => updateElement({ placeholder: e.target.value });
    	const change_handler_11 = e => updateElement({ name: e.target.value });
    	const input_handler_3 = e => updateElement({ html: e.target.value });
    	const change_handler_12 = e => updateElement({ name: e.target.value });

    	function input1_change_handler() {
    		element.from_selection = this.checked;
    		$$invalidate(0, element);
    	}

    	const change_handler_13 = e => updateElement({ name: e.target.value });
    	const change_handler_14 = e => updateElement({ label: e.target.value });
    	const change_handler_15 = e => updateElement({ num_layers: parseInt(e.target.value) });
    	const input_handler_4 = (index, e) => handleOptionChange(e, index, 'text');
    	const input_handler_5 = (index, e) => handleOptionChange(e, index, 'value');
    	const click_handler_1 = index => removeOption(index);
    	const change_handler_16 = e => updateElement({ widget_name: e.target.value });

    	function select_change_handler() {
    		element.widget_name = select_value(this);
    		$$invalidate(0, element);
    	}

    	const change_handler_17 = e => updateElement({ regex: e.target.value });
    	const input_handler_6 = e => updateElement({ min: e.target.value });
    	const input_handler_7 = e => updateElement({ max: e.target.value });
    	const input_handler_8 = e => updateElement({ step: e.target.value });

    	const click_handler_2 = () => {
    		updateElement({ type: "slider" });
    	};

    	const click_handler_3 = () => {
    		updateElement({ type: "number" });
    	};

    	const click_handler_4 = () => deleteElement();
    	const click_handler_5 = () => cloneElement();

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('showProperties' in $$props) $$invalidate(3, showProperties = $$props.showProperties);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('readonly' in $$props) $$invalidate(4, readonly = $$props.readonly);
    		if ('no_edit' in $$props) $$invalidate(5, no_edit = $$props.no_edit);
    		if ('advancedOptions' in $$props) $$invalidate(2, advancedOptions = $$props.advancedOptions);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		element,
    		showProperties,
    		layer_image_preview,
    		magnifier_preview,
    		metadata,
    		LayerStack3D,
    		onMount,
    		mappingsHelper,
    		dispatch,
    		value,
    		readonly,
    		no_edit,
    		layers,
    		updateElement,
    		handleOptionChange,
    		addOption,
    		removeOption,
    		openProperties,
    		closeProperties,
    		deleteElement,
    		cloneElement,
    		changeValue,
    		html,
    		generateElement,
    		advancedOptions,
    		getParameterValue,
    		elementRoot,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('showProperties' in $$props) $$invalidate(3, showProperties = $$props.showProperties);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('readonly' in $$props) $$invalidate(4, readonly = $$props.readonly);
    		if ('no_edit' in $$props) $$invalidate(5, no_edit = $$props.no_edit);
    		if ('layers' in $$props) $$invalidate(10, layers = $$props.layers);
    		if ('html' in $$props) $$invalidate(6, html = $$props.html);
    		if ('advancedOptions' in $$props) $$invalidate(2, advancedOptions = $$props.advancedOptions);
    		if ('elementRoot' in $$props) $$invalidate(7, elementRoot = $$props.elementRoot);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*element*/ 1) {
    			{
    				if (element && element._force_render) {
    					generateElement();
    					$$invalidate(0, element._force_render = false, element);
    				}
    			}
    		}
    	};

    	return [
    		element,
    		value,
    		advancedOptions,
    		showProperties,
    		readonly,
    		no_edit,
    		html,
    		elementRoot,
    		$metadata,
    		dispatch,
    		layers,
    		updateElement,
    		handleOptionChange,
    		addOption,
    		removeOption,
    		openProperties,
    		closeProperties,
    		deleteElement,
    		cloneElement,
    		changeValue,
    		click_handler,
    		change_handler,
    		change_handler_1,
    		change_handler_2,
    		change_handler_3,
    		change_handler_4,
    		change_handler_5,
    		change_handler_6,
    		change_handler_7,
    		div_binding,
    		input_handler,
    		change_handler_8,
    		input_handler_1,
    		input3_change_handler,
    		input_change_handler,
    		change_handler_9,
    		change_handler_10,
    		input_change_handler_1,
    		input_handler_2,
    		change_handler_11,
    		input_handler_3,
    		change_handler_12,
    		input1_change_handler,
    		change_handler_13,
    		change_handler_14,
    		change_handler_15,
    		input_handler_4,
    		input_handler_5,
    		click_handler_1,
    		change_handler_16,
    		select_change_handler,
    		change_handler_17,
    		input_handler_6,
    		input_handler_7,
    		input_handler_8,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class FormElement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$9,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				element: 0,
    				showProperties: 3,
    				value: 1,
    				readonly: 4,
    				no_edit: 5,
    				advancedOptions: 2
    			},
    			add_css$9,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormElement",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get element() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showProperties() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showProperties(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get no_edit() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set no_edit(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get advancedOptions() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set advancedOptions(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class rulesExecution {
        constructor() {
            this.defaultFields=new mappingsHelper().getDefaultFields();

        }
        /**
         * @param {string} fieldName 
         * @param {array} fieldList 
         * @returns {object} the field object
         */
        getField(fieldName,fieldList) {
            if (!fieldList) return
            for(let i=0;i<fieldList.length;i++) {
                let field=fieldList[i];
                if (field.name===fieldName) return field
            }
            for(let i=0;i<this.defaultFields.length;i++) {
                let field=this.defaultFields[i];
                if (field.name===fieldName) return field
            }        
        }
        checkArray(fieldName) {
            return fieldName.includes("[]")
        }
        getArrayName(fieldName) {
            if (!this.checkArray(fieldName)) return
            return fieldName.split("[")[0]  // e.g. controlnet
        }    
        // type conversion based on field type
        convertValue(value,field) {
            if (!field) return ""
            if (field.type==="checkbox" || field.type==="boolean") {
                if (value==="true") return true
                if (value==="false") return false
            }
            if (field.type==="slider" || field.type==="number") {
                if (this.isFloat(field.step)) {
                    return parseFloat(value)
                }
                return parseInt(value)

            }
            return value
        }
        /**
         * gets value from custim fields and default fields
         * @param {object} data the data object 
         * @param {string} fieldName the field name including array name
         * @param {array} fieldList all custom fields
         * @param {object} arrayIdx array index for each array (e.g. controlnet: 0)
         * @returns {*}  the value
         */
        getValue(data,fieldName,fieldList,arrayIdx) {
            let field=this.getField(fieldName,fieldList);
            if (!this.checkArray(fieldName)) {
                let value= data[fieldName];
                return this.convertValue(value,field)
            }
            let arrayName= fieldName.split("[")[0];  // e.g. controlnet
            let propertyName= fieldName.split(".")[1];  // e.g. image
            let i=arrayIdx[arrayName];
            if (!data[arrayName]) throw 'array_not_found ' + arrayName
            if (!data[arrayName][i]) throw 'index_in_array_not_found ' + arrayName + ' ' + i

            let value= data[arrayName][i][propertyName];
            return  this.convertValue(value,field)
        }

        setValue(data,value,fieldName,fieldList,arrayIdx) {
            let field=this.getField(fieldName,fieldList);
            if (!this.checkArray(fieldName)) {
                data[fieldName]= this.convertValue(value,field);
                return
            }       
            let arrayName= fieldName.split("[")[0];  // e.g. controlnet
            let propertyName= fieldName.split(".")[1];  // e.g. image
            let i=arrayIdx[arrayName];
            value=this.convertValue(value,field);
            data[arrayName][i][propertyName]=value;

        }
        
        isFloat(value) {
            if (typeof value !== 'number' || isNaN(value)) {
              return false; // It's not a number or is NaN (Not a Number)
            }        
            return value % 1 !== 0; // If there's a decimal part, it's a float
          } 
        /**
         * execute rules on real data
         * @param {object} data the form data 
         * @param {array} fieldList the list of field definitions
         * @param {array} rules the rules list
         * @param {object} arrayIdx array index for each array (e.g. controlnet: 0)
         * @param {string} arrayName optional: limit rules execution to that array only
         * @returns {object} {data,hiddenFields}  data and list of hidden fields
         */
        execute(data,fieldList,rules,arrayIdx={},arrayName="") {
            if (!rules) rules = [];
            if (!data) return { data, hiddenFields: {}, showFields: {} }
            let hiddenFields = [];
            let showFields = [];
            for (let i = 0; i < rules.length; i++) {
                // { fieldName, condition, actionType, rightValue, targetField, actionValue }
                let rule = rules[i];
                let field = this.getField(rule.fieldName, fieldList);

                if (arrayName === '__ignore_arrays' && this.checkArray(field.name)) continue
                let leftValue;
                try {
                    leftValue = this.getValue(data, rule.fieldName, fieldList, arrayIdx);
                } catch (e) {
                    // value cannot read here because not available in data object
                    continue
                }

                let rightValue = rule.rightValue;
                if (!field) {
                    console.error('rule execution field not found:', rule.fieldName);
                    continue
                }
                if (arrayName && arrayName !== '__ignore_arrays' && !this.checkArray(field.name)) continue // array mode, but field is not an array
                if (arrayName && arrayName !== '__ignore_arrays' && this.getArrayName(field.name) !== arrayName) continue // other arrays ignore

                rightValue = this.convertValue(rightValue, field);
                leftValue = this.convertValue(leftValue, field);

                let res = false;
                switch (
                    rule.condition // ['==', '!=', '>', '<', '>=', '<=']
                ) {
                    case '===':
                    case '==':
                        if (leftValue === rightValue) res = true;
                        break
                    case '!=':
                    case '!==':
                        if (leftValue !== rightValue) res = true;
                        break
                    case '>':
                        if (leftValue > rightValue) res = true;
                        break
                    case '<=':
                        if (leftValue <= rightValue) res = true;
                        break
                    case '>=':
                        if (leftValue >= rightValue) res = true;
                        break
                    case '<':
                        if (leftValue < rightValue) res = true;
                        break
                }
                console.log('executed:', leftValue, rule.condition, rightValue, res);
                if (!res) continue // rule will be not executed because condition is false

                let targetFieldName;
                let targetField;
                if (rule.targetField) {
                    targetFieldName = rule.targetField;
                    targetField = this.getField(targetFieldName, fieldList);
                    if (!targetField) {
                        console.error('rule execution target field not found:', targetFieldName);
                        continue
                    }
                }

                if (rule.actionType === 'setValue') {
                    let value = rule.actionValue;
                    this.setValue(data, value, targetFieldName, fieldList, arrayIdx);
                }
                if (rule.actionType === 'hideField') {
                    hiddenFields.push(rule.targetField);
                    targetField.hideIt = true;
                    targetField.showIt = false;
                }
                if (rule.actionType === 'showField') {
                    showFields.push(rule.targetField);
                    targetField.showIt = true;
                    targetField.hideIt = false;
                }
                if (rule.actionType === 'copyValue') {
                    let fromFieldName = rule.actionValue;
                    let fromField = this.getField(rule.actionValue, fieldList);
                    if (!fromField) {
                        console.error('rule execution from field not found:', fromFieldName);
                        continue
                    }
                    let value = this.getValue(data, fromFieldName, fieldList, arrayIdx);
                    this.setValue(data, value, targetFieldName, fieldList, arrayIdx);
                }
                if (rule.actionType === 'copyParameter') {
                    let fromFieldName = rule.actionValue;
                    let fromField = this.getField(rule.actionValue, fieldList);
                    if (!fromField) {
                        console.error('rule execution from field not found:', fromFieldName);
                        continue
                    }
                    let value = this.getValue(data, fromFieldName, fieldList, arrayIdx);
                    let field = this.getField(targetFieldName, fieldList);
                    field._force_render = true;
                    field[rule.targetParameter] = value;
                }
            }        
            return { data, hiddenFields, showFields }
        }

    }

    var formTemplate_Txt2Image = {"default":{elements:[{name:"number_images",type:"slider",label:"Number images",options:[],"default":1,min:1,max:4,step:1},{name:"advanced_options",type:"advanced_options",label:"",options:[],"default":""},{name:"seed",type:"text",label:"Seed",options:[],"default":"",placeholder:"Empty = Random"}]}};

    var formTemplate_LayerMenu = {"default":{elements:[{name:"magnifier",type:"magnifier"},{name:"currentLayer",type:"layer_image",label:"Value_6y0om",options:[],"default":""},{name:"advanced_options",type:"advanced_options",label:"",options:[],"default":""},{name:"newLayer",type:"checkbox",label:"New Layer",options:[],"default":"true"},{name:"preview",type:"checkbox",label:"Preview",options:[],"default":"true",hidden:true}]}};

    /* src\Icon.svelte generated by Svelte v3.59.2 */
    const file$7 = "src\\Icon.svelte";

    function add_css$8(target) {
    	append_styles(target, "svelte-r7fnpc", ".default.svelte-r7fnpc.svelte-r7fnpc{fill:white;display:inline-block;cursor:pointer;width:30px;text-align:center}.default.svelte-r7fnpc.svelte-r7fnpc:hover,.active.svelte-r7fnpc.svelte-r7fnpc{fill:black;background-color:#ddb74f;border-radius:5px}.deactivate.svelte-r7fnpc.svelte-r7fnpc{fill:grey;cursor:default}.deactivate.svelte-r7fnpc.svelte-r7fnpc:hover{fill:grey;background:transparent}.default.svelte-r7fnpc svg.svelte-r7fnpc{display:inline-block}.leftMenuIcon.svelte-r7fnpc.svelte-r7fnpc{padding-top:8px;height:30px}.leftMenuIcon2.svelte-r7fnpc.svelte-r7fnpc{padding-top:4px;height:30px}.leftMenuIcon3.svelte-r7fnpc.svelte-r7fnpc{height:30px}.leftMenuTopMargin.svelte-r7fnpc.svelte-r7fnpc{margin-top:20px}.outer.svelte-r7fnpc.svelte-r7fnpc{display:inline-block;cursor:pointer}.arrowRight.svelte-r7fnpc.svelte-r7fnpc{fill:white;display:inline-block;width:30px;text-align:center;vertical-align:-5px}.comboList.svelte-r7fnpc.svelte-r7fnpc{vertical-align:-4px;margin-left:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbi5zdmVsdGUiLCJzb3VyY2VzIjpbIkljb24uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICBcdGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYW1lPVwiXCJcclxuICAgICAgICBleHBvcnQgbGV0IHN0YXRlPVwiXCJcclxuICAgICAgICBleHBvcnQgbGV0IGRlYWN0aXZhdGU9XCJcIlxyXG4gICAgICAgIGV4cG9ydCBsZXQgc3ZnPVwiXCJcclxuICAgICAgICBsZXQgYWN0aXZlQ2xhc3M9XCJcIlxyXG4gICAgICAgIGlmIChzdGF0ZT09PW5hbWUgJiYgIXN2ZykgYWN0aXZlQ2xhc3M9XCIgYWN0aXZlXCJcclxuICAgICAgICBpZiAoZGVhY3RpdmF0ZT09PVwiZGVhY3RpdmF0ZVwiKSBhY3RpdmVDbGFzcz1cIiBkZWFjdGl2YXRlXCJcclxuXHJcbiAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcclxuICAgICAgICBsZXQgaWNvbnNJbmZvPXtcclxuICAgICAgICAgICAgXCJkb3duXCI6e2NsYXNzOlwiZGVmYXVsdFwifSwgXHJcbiAgICAgICAgICAgIFwidXBcIjp7Y2xhc3M6XCJkZWZhdWx0XCJ9LFxyXG4gICAgICAgICAgICBcImNsb3NlXCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb25cIn0sXHJcbiAgICAgICAgICAgIFwibGlzdFwiOntjbGFzczpcImRlZmF1bHQgbGVmdE1lbnVJY29uXCJ9LFxyXG4gICAgICAgICAgICBcImFycm93UmlnaHRcIjp7Y2xhc3M6XCIgYXJyb3dSaWdodCBcIn0sXHJcbiAgICAgICAgICAgIFwiY29tYm9MaXN0XCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb24yIGNvbWJvTGlzdFwifSxcclxuICAgICAgICAgICAgXCJyZW1vdmVGcm9tTGlzdFwiOntjbGFzczpcImRlZmF1bHQgbGVmdE1lbnVJY29uXCJ9LFxyXG4gICAgICAgICAgICBcInByb3BlcnRpZXNcIjp7Y2xhc3M6XCJkZWZhdWx0IGxlZnRNZW51SWNvbjIgbGVmdE1lbnVUb3BNYXJnaW5cIn0sXHJcbiAgICAgICAgICAgIFwiZWRpdEZvcm1cIjp7Y2xhc3M6XCJkZWZhdWx0IGxlZnRNZW51SWNvbjIgbGVmdE1lbnVUb3BNYXJnaW5cIn0sXHJcbiAgICAgICAgICAgIFwiZWRpdFJ1bGVzXCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb24yIGxlZnRNZW51VG9wTWFyZ2luXCJ9LFxyXG4gICAgICAgICAgICBcImVycm9ybG9nc1wiOntjbGFzczpcImRlZmF1bHQgbGVmdE1lbnVJY29uMiBsZWZ0TWVudVRvcE1hcmdpblwifSxcclxuICAgICAgICAgICAgXCJHeXJlTGVmdE1lbnVcIjp7Y2xhc3M6XCJkZWZhdWx0IGxlZnRNZW51SWNvbjMgbGVmdE1lbnVUb3BNYXJnaW5cIn0sXHJcbiAgICAgICAgICAgIFwiZm9ybV90ZXh0XCI6e2NsYXNzOlwiZGVmYXVsdCBkZWFjdGl2YXRlXCJ9LCBcclxuICAgICAgICAgICAgXCJmb3JtX3RleHRhcmVhXCI6e2NsYXNzOlwiZGVmYXVsdCBkZWFjdGl2YXRlXCJ9LCBcclxuICAgICAgICAgICAgXCJmb3JtX2NoZWNrYm94XCI6e2NsYXNzOlwiZGVmYXVsdCBkZWFjdGl2YXRlXCJ9LCBcclxuICAgICAgICAgICAgXCJmb3JtX2Ryb3Bkb3duXCI6e2NsYXNzOlwiZGVmYXVsdCBkZWFjdGl2YXRlXCJ9LCBcclxuICAgICAgICAgICAgXCJmb3JtX3NsaWRlclwiOntjbGFzczpcImRlZmF1bHQgZGVhY3RpdmF0ZVwifSwgXHJcbiAgICAgICAgICAgIFwiZm9ybV9sYXllcnNcIjp7Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn0sIFxyXG4gICAgICAgICAgICBcImZvcm1fbGF5ZXJzMlwiOntjbGFzczpcImRlZmF1bHQgZGVhY3RpdmF0ZVwifSwgXHJcbiAgICAgICAgICAgIFwiZm9ybV9sYXllcnMzXCI6e2NsYXNzOlwiZGVmYXVsdCBkZWFjdGl2YXRlXCJ9LCBcclxuICAgICAgICAgICAgXCJmb3JtX3ByZXZpZXdcIjp7Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn0sIFxyXG4gICAgICAgICAgICBcImZvcm1fYWR2YW5jZWRcIjp7Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn0sIFxyXG4gICAgICAgICAgICBcImZvcm1fY29sb3JwaWNrZXJcIjp7Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn0sIFxyXG4gICAgICAgICAgICBcImZvcm1fbWFnbmlmaWVyXCI6e2NsYXNzOlwiZGVmYXVsdCBkZWFjdGl2YXRlXCJ9LCBcclxuICAgICAgICAgICAgXCJmb3JtX3RleHRfb3V0cHV0XCI6e2NsYXNzOlwiZGVmYXVsdCBkZWFjdGl2YXRlXCJ9LCBcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpbmZvXHJcbiAgICAgICAgaWYgKHN2ZykgaW5mbz17Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn1cclxuICAgICAgICBlbHNlIGluZm89aWNvbnNJbmZvW25hbWVdXHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZT1cIm91dGVyXCJcclxuICAgICAgICBpZiAoaW5mbykgY2xhc3NOYW1lPWluZm8uY2xhc3NcclxuICAgICAgICBjbGFzc05hbWUrPWFjdGl2ZUNsYXNzXHJcbjwvc2NyaXB0PlxyXG48IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG48ZGl2IGNsYXNzPXtjbGFzc05hbWV9ICBvbjptb3VzZWRvd249eyhlKSA9PiB7IGRpc3BhdGNoKFwibW91c2Vkb3duXCIsZSkgfX0gIG9uOmNsaWNrPXsoZSkgPT4geyBkaXNwYXRjaChcImNsaWNrXCIsZSkgfX0gICAgPlxyXG4gICAgeyNpZiBzdmd9e0BodG1sIHN2Z317L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJtb3ZlXCJ9XHJcbiAgICAgICAgPHN2ZyAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjRkZGXCJcclxuICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCJcclxuICAgICAgICBpZD1cImRyYWdNb2RlbE1hbmFnZXJUb3BCYXJJY29uXCIgY3Vyc29yPVwibW92ZVwiPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNOSA1bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTkgMTJtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwXCI+PC9wYXRoPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNOSAxOW0tMSAwYTEgMSAwIDEgMCAyIDBhMSAxIDAgMSAwIC0yIDBcIj48L3BhdGg+XHJcbiAgICAgICAgPHBhdGggZD1cIk0xNSA1bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTE1IDEybS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTE1IDE5bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImRvd25cIn1cclxuICAgICAgICA8c3ZnICB2aWV3Qm94PVwiMCAwIDMyMCA1MTJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiPjxwYXRoIGQ9XCJNMzEwLjYgMjQ2LjZsLTEyNy4xIDEyOEMxNzYuNCAzODAuOSAxNjguMiAzODQgMTYwIDM4NHMtMTYuMzgtMy4xMjUtMjIuNjMtOS4zNzVsLTEyNy4xLTEyOEMuMjI0NCAyMzcuNS0yLjUxNiAyMjMuNyAyLjQzOCAyMTEuOFMxOS4wNyAxOTIgMzIgMTkyaDI1NS4xYzEyLjk0IDAgMjQuNjIgNy43ODEgMjkuNTggMTkuNzVTMzE5LjggMjM3LjUgMzEwLjYgMjQ2LjZ6XCIvPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwidXBcIn1cclxuICAgICAgICA8c3ZnICB2aWV3Qm94PVwiMCAwIDMyMCA1MTJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiPjxwYXRoIGQ9XCJNOS4zOSAyNjUuNGwxMjcuMS0xMjhDMTQzLjYgMTMxLjEgMTUxLjggMTI4IDE2MCAxMjhzMTYuMzggMy4xMjUgMjIuNjMgOS4zNzVsMTI3LjEgMTI4YzkuMTU2IDkuMTU2IDExLjkgMjIuOTEgNi45NDMgMzQuODhTMzAwLjkgMzIwIDI4Ny4xIDMyMEgzMi4wMWMtMTIuOTQgMC0yNC42Mi03Ljc4MS0yOS41OC0xOS43NVMuMjMzMyAyNzQuNSA5LjM5IDI2NS40elwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cInNhdmVcIn1cclxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIzXCIgaGVpZ2h0PVwiMjNcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ3aGl0ZVwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cInRhYmxlci1pY29uIHRhYmxlci1pY29uLWRldmljZS1mbG9wcHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBmb2N1c2FibGU9XCJmYWxzZVwiPjxwYXRoIGQ9XCJNNiA0aDEwbDQgNHYxMGEyIDIgMCAwIDEgLTIgMmgtMTJhMiAyIDAgMCAxIC0yIC0ydi0xMmEyIDIgMCAwIDEgMiAtMlwiPjwvcGF0aD48cGF0aCBkPVwiTTEyIDE0bS0yIDBhMiAyIDAgMSAwIDQgMGEyIDIgMCAxIDAgLTQgMFwiPjwvcGF0aD48cGF0aCBkPVwiTTE0IDRsMCA0bC02IDBsMCAtNFwiPjwvcGF0aD48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cIkd5cmVcIiB8fCBuYW1lPT09XCJHeXJlTGVmdE1lbnVcIn1cclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1taXNzaW5nLWF0dHJpYnV0ZSAtLT5cclxuICAgICAgICA8aW1nIHNyYz1cImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjRBQUFBZENBTUFBQUNLZWl3K0FBQUMvVkJNVkVVQUFBQWZRMUZKTkVRNFRWRWZQRmNzZDVNZ1NHRWVTbHB6ZjVjK3NNZ1hpYThYVDIwdmdwY21PRkVkTlUwWVlvV2pRMnBNVDJvZ2FuSmVMVXhaTjBCT1NsQWNrL2gxaHFjazVQWlFYbjBiTEVRb3RkY1VHeTFIKy84VWZLaEFnZDNxaUxjODF1Z3Z5TjRqZDhycFdvc25NMDFFb0xGSndjM1djYU5ZWDJJbXQ4aDZlNFpEZXJlM3ZjMnNzYjhmZ3A2WkhWaHVjNEFsaTZKUmRwMm9XRUNKa0prSlJtdENTVkFvUUZsNGUzOG1kbjFsWjJJa1BscWtWUDhIa3Y4R0JSQUFoLzg4WVdvTkR4MUsvdjg3K2Y4QnhmOEpmZi9oa1BvTlIrLy9jNU1zVUZvZk5rY1RHQ2dCQUFWbi8vOVgvLzh4L1A4Yjd2OWEzLzhhenY4RHAvL1RnUCthVFArNVJmK3dRUDhOenY0ZjJ2Mi9hUDNrbVB3NzR2dkplZnMxMnZtNDJma0JidTd5ak9pdXRkWUZROVRvbjlNQ004N3NXTXZ1YU1yamJzWUNKTE5VTXBFS0czLzdWM0FmUUc4dFVXeDBBR1VuUzJNMFJsVW5RVlJ2QUZNbk5GQWNMRWovbmo0V0tEb1RIRGdXSWpVVUlTeit3dzE3Ly84MjhQOHo3UDhNNS8vUTV2OXEzUC8xMVA4QXZQOEFzZi9sb3YvL25mOUFtdi8vYlArNlR2Ly9SditpUmY4TlZ2NUg2djFZei8zU2lQMkk0ZnhtdGZ6WXQvdnF5dmdhbS9jQWd2ZWVkdmU0WVBhUjB2VnAwUFJaeFBSQnhmS3lTdkdoelBCQXIvRC9jK3dIdU9zRFUrcmtsT25YYXVuS1dlbkNoZVRSUnVPVG4rSThpT0NVemQzbFVkei9sTnYvdHRyYWN0cTFxTmtabHRjQlpkUVhoTkkvdWRHTXh0QnBxcy9TZXMzdWhNY0NZTWYvNHNMTFk4RWtZc0VHUGIwU2U3cGxTYmptVmJlMmM3YmlsclVmaTdQMWFiRC9TNi9yU3ExdFhLd29RNnoxc0tTZFRLVDBzNkZ2ZjZCTGRaN1daNTVwWjU0dWhKc0dIcGY0VXBYYW9wTXNncExMQUpMNlk0K2lBSTdqUll2a0FJbkZKb2MwZW9iOGFJTWNPWUo0SW9KRFZvRDB3WDlXSkg0UkxIanpQbmZKUG5Ub1hYQk5BSENiRTJ3VEoybGhqbU54b0dJZ09XR3RJMkJoaWwyYUVWU2ZKRktSQzFIL3RVeVpBRXYvZzBwbmQwaG5BRVBNbnpyL3RpZi9weWIvaVNDWWlCVC9wQURtbmdEU213REZrUUQvalFETk4zTjdBQUFBUFhSU1RsTUFHUkFLazN3M0tkcS9sWldOZTNGblgwaERReHNWL2YzNit2cjI5dkx0NStIZzJkSFB5OG5FdzcycG1waVRqSXlLZlhoeWNXMWpZRnBYTlNRZDBsUzJ2UUFBQWNoSlJFRlVLTTlpb0NJd1V1UFJzc0lwcSs4WDJ5Q2h4SWhMbXRNdktwQ1ZnUm03SkJ1N3V2T3NKalljV2htTmVUaGRaamF6WXBjVlpkU1JYemsvUHFGUmlJRUppelEvbDNKSC82VHBTeGNzRThRaXl5NjlkNDVMUUcxQzB1TDJ0U2Jva3N5TVFuS2JYYUxtbmJ6N0lQdlkrcDBxQXVqbWN4OXlkazErOXVYdHUvY2xUL2RONmRSQTg1MVpyR3ZRMlkrNVZ6MXZQM2xka2oyNVcwRVUxV1gxclJPdlA4cVk2NTZVNGZtNDRGemI2alhDeU5Lc2RhNWJjdmVIQVJZOUljNTJpZWZOZ2xWQm1TSklzaUpiZ3lOZi9saHVHNU42SXNaMjNjVnJCNXhYQ0NCa3JiWFBUQTI4L0N2ZE52Umd6YWxRMjhOWGR2blBOa0M0M3BTamFMZWR3ODl2NGJidWwxTGRiVE52Yk91TFI3SmI5M1JwZnByZHhqOGZ3bnVpNDJhRUhUMlN2RkFXeVdvOThjcWlPeDUyTy83V2JPK0tpRWovZEg5RGdDS1N0Q1ZIV1pWampvZGQ0dWZmMzh2TC8zM2RGT25QaFJ5b2h2ZWNpb0h5Ymc2SnQ5NjhPRCt0SlZnTUpjMHdTVmJhZXprK3orcDFjM0N3Q3dseFc0U1dLc3hMblh5TEhmTWZYc2hLUzBuWmN4d2pVbmtyN0gyckM3MjhDdlB5WG5scllzYTRSWm1QdmE5VGhiZDN0WThxdHVURXhDSlY1V1J2N3lQRGl5TTFzdk94Y0xQdzJSQ2ZiUUJ1TzUzMGJPOGNHd0FBQUFCSlJVNUVya0pnZ2c9PVwiPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwibGlzdFwifVxyXG4gICAgICAgIDxzdmcgIHZpZXdCb3g9XCIwIDAgMTQgMTRcIiAgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtMSA5LjYyNjI3MTVoMTJ2Mi42ODM3MTk1aC0xMnptMC0zLjkwOTg0NGgxMnYyLjY4Mjg4aC0xMnptMC00LjAyNjQxOGgxMnYyLjY4NDU1OGgtMTJ6XCIvPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwicHJvcGVydGllc1wifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTMuNjU4MDcwMyAxMC44MTYxNDJxMC0uMTg5Nzc5LS4xMzg4MjgzLS4zMjg2MDctLjEzODgyODMtLjEzODgyOC0uMzI4NjA3LS4xMzg4MjgtLjE4OTc3ODggMC0uMzI4NjA3MS4xMzg4MjgtLjEzODgyODMuMTM4ODI4LS4xMzg4MjgzLjMyODYwNyAwIC4xODk3NzkuMTM4ODI4My4zMjg2MDcuMTM4ODI4My4xMzg4MjguMzI4NjA3MS4xMzg4MjguMTg5Nzc4NyAwIC4zMjg2MDctLjEzODgyOC4xMzg4MjgzLS4xMzg4MjguMTM4ODI4My0uMzI4NjA3em00LjcwMzgwMTgtMy4wNjczMTA2LTQuOTgwOTkxIDQuOTgwOTkwNnEtLjI3MDE3NzYuMjcwMTc4LS42NTcyMTQuMjcwMTc4LS4zNzk1NTc1IDAtLjY2NDY5MzEtLjI3MDE3OGwtLjc3NDA3MjktLjc4ODU2M3EtLjI3NzY1NjYtLjI2MjY5OS0uMjc3NjU2Ni0uNjU3MjE0IDAtLjM4NzAzNy4yNzc2NTY2LS42NjQ2OTNsNC45NzM5Nzk0LTQuOTczOTc5NnEuMjg0NjY4MS43MTU2NDM1LjgzNjI0MTggMS4yNjcyMTcyLjU1MTU3MzcuNTUxNTczNyAxLjI2NzIxNzIuODM2MjQxOHptNC42MzA0MTM5LTMuMTc3MTU4cTAgLjI4NDY2ODEtLjE2NzgwOC43NzQwNzI5LS4zNDMwOTkuOTc4ODA5Ni0xLjIwMTMxIDEuNTg4MzQ1My0uODU4MjExLjYwOTUzNTctMS44ODc5NzA5LjYxMDAwMzEtMS4zNTEzNTU1IDAtMi4zMTE0Njc3LS45NjA1Nzk2LS45NjAxMTIyLS45NjA1Nzk2LS45NjA1Nzk2LTIuMzExNDY3Ny0uMDAwNDY3NS0xLjM1MDg4ODIuOTYwNTc5Ni0yLjMxMTQ2NzguOTYxMDQ3LS45NjA1Nzk2IDIuMzExNDY3Ny0uOTYwNTc5Ni40MjM0OTU5IDAgLjg4NzE5MTkuMTIwNTk4My40NjM2OTYuMTIwNTk4My43ODUyOTIuMzM5ODI1NS4xMTY4NTkuMDgwMzk5LjExNjg1OS4yMDQ3MzY3IDAgLjEyNDMzNzgtLjExNjg1OS4yMDQ3MzY3bC0yLjEzOTkxOTIgMS4yMzQ0OTY3djEuNjM2MDIzN2wxLjQwOTc4NTIuNzgxNTUxOXEuMDM2NDYtLjAyMTk2OS41NzY4MTQtLjM1NDMxNi41NDAzNTYtLjMzMjM0NjYuOTg5NTYyLS41OTE3NzMyLjQ0OTIwNC0uMjU5NDI2Ni41MTUxMTQtLjI1OTQyNjYuMTA5Mzc5IDAgLjE3MTU0OC4wNzI5Mi4wNjIxNy4wNzI5Mi4wNjIxNy4xODI3NjczelwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImVkaXRGb3JtXCJ9XHJcbiAgICAgICAgPHN2ZyAgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMTQgMTRcIj48cGF0aCBkPVwibSAxLjE5OTc5OTUsMTIuOTkzOTE2IGMgLTAuMDc5MDM0LC0wLjAyMyAtMC4xNjQwNzEsLTAuMTA5MyAtMC4xODc5ODEzLC0wLjE5MTQgLTAuMDEyMDA1LC0wLjA0MiAtMC4wMTMwMDYsLTAuNjg5NSAtMC4wMTEwMDUsLTUuODIxMDAwMyBsIDAsLTUuNzc0IDAuMDIyMDEsLTAuMDQ1IGMgMC4wMjgwMTIsLTAuMDU3IDAuMDgzMDM2LC0wLjExMTcgMC4xNDAxNjA2LC0wLjE0MDEgbCAwLjA0NTAxOSwtMC4wMjIgNS43OTIyMDQxLDAgNS43OTIzMDQxLDAgMC4wNTEwMiwwLjAyNSBjIDAuMDU2MDIsMC4wMjcgMC4xMDM2NDUsMC4wNzUgMC4xMzU0NTksMC4xMzQ1IGwgMC4wMjEwMSwwLjAzOSAwLDUuNzgzMiBjIDAsNS4zNzY1MDAzIDAsNS43ODY2MDAzIC0wLjAxMzAxLDUuODMxMTAwMyAtMC4wMTkwMSwwLjA2IC0wLjA3OTAzLDAuMTI5MSAtMC4xNDE3NjEsMC4xNjIxIGwgLTAuMDQ2MDIsMC4wMjQgLTUuNzg3NzAyMywwIGMgLTMuNDU2Mjk0Miw5ZS00IC01Ljc5OTIwNywwIC01LjgxNjAxNDMsLTAuMDEgeiBtIDExLjIzNjY1NzUsLTUuOTkxOTAwMyAwLC01LjQzNDIgLTUuNDMxOTQ4MSwwIC01LjQzMTg0ODIsMCAwLDUuNDIyOSBjIDAsMi45ODI2IC00LjAwMmUtNCw1LjQyODAwMDMgMCw1LjQzNDIwMDMgMCwwLjAxIDEuMDk5MDc1MSwwLjAxMSA1LjQzNjU1MDIsMC4wMTEgbCA1LjQzMjE0ODEsMCAwLC01LjQzNDIwMDMgeiBtIC02Ljg2MTk2NjMsMy43MTgxMDAzIDAsLTAuODYwMzAwMyAwLjg1NTc2OTksMCAwLjg1NTc3LDAgMCwwLjg2MDMwMDMgMCwwLjg2MDMgLTAuODU1NzcsMCAtMC44NTU3Njk5LDAgMCwtMC44NjAzIHogbSAxLjE0Mzk5NDUsMCAwLC0wLjI4MzggLTAuMjg4MjI0NiwwIC0wLjI4ODMyNDYsMCAwLDAuMjgzOCAwLDAuMjgzNyAwLjI4ODMyNDYsMCAwLjI4ODIyNDYsMCAwLC0wLjI4MzcgeiBtIDEuMTQ0MDk0NywwIDAsLTAuMjgzOCAxLjcxNjA0MTgsMCAxLjcxNjA0MTMsMCAwLDAuMjgzOCAwLDAuMjgzNyAtMS43MTYwNDEzLDAgLTEuNzE2MDQxOCwwIDAsLTAuMjgzNyB6IG0gLTIuMjg4MDg5MiwtMy4xNDgzMDAzIDAsLTEuMTQ0MSAyLjg2MDAzNjQsMCAyLjg2MDEzNTksMCAwLDEuMTQ0MSAwLDEuMTQzOSAtMi44NjAxMzU5LDAgLTIuODYwMDM2NCwwIDAsLTEuMTQzOSB6IG0gNS4xNDM2MjMzLDAgMCwtMC41NzIxIC0yLjI4ODA4ODgsMCAtMi4yODgwODkyLDAgMCwwLjU2NjEgYyAwLDAuMzExMyAwLDAuNTY4NyAwLjAxMDAwNCwwLjU3MiAwLDAgMS4wMzI5NDY2LDAuMDEgMi4yODgwODkyLDAuMDEgbCAyLjI4MjA4NjgsMCAwLC0wLjU3MiB6IG0gLTcuOTk5MjU3OCwwIDAsLTAuMjg4NCAxLjEzOTU5MjcsMCAxLjEzOTQ5MjUsMCAwLDAuMjg4NCAwLDAuMjg4MiAtMS4xMzk0OTI1LDAgLTEuMTM5NTkyNywwIDAsLTAuMjg4MiB6IG0gMi44NTU2MzQ1LC0zLjQzMjEgMCwtMS4xNDQxIDIuODYwMDM2NCwwIDIuODYwMTM1OSwwIDAsMS4xNDQxIDAsMS4xNDQgLTIuODYwMTM1OSwwIC0yLjg2MDAzNjQsMCAwLC0xLjE0NCB6IG0gNS4xNDM2MjMzLDAgMCwtMC41NzIxIC0yLjI4ODA4ODgsMCAtMi4yODgwODkyLDAgMCwwLjU2NjEgYyAwLDAuMzExMiAwLDAuNTY4NiAwLjAxMDAwNCwwLjU3MTkgMCwwIDEuMDMyOTQ2NiwwLjAxIDIuMjg4MDg5MiwwLjAxIGwgMi4yODIwODY4LDAgMCwtMC41NzE5IHogbSAtNy45OTkyNTc4LDAgMCwtMC4yODM5IDEuMTM5NTkyNywwIDEuMTM5NDkyNSwwIDAsMC4yODM5IDAsMC4yODM3IC0xLjEzOTQ5MjUsMCAtMS4xMzk1OTI3LDAgMCwtMC4yODM3IHpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfSAgICBcclxuICAgIHsjaWYgbmFtZT09PVwiZWRpdFJ1bGVzXCJ9XHJcbiAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDE0IDE0XCIgIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTYuNiA2Ljk5NjkyNXEwLS42NjI1LS40Njg3NS0xLjEzMTI1LS40Njg3NS0uNDY4NzUtMS4xMzEyNS0uNDY4NzUtLjY2MjUgMC0xLjEzMTI1LjQ2ODc1LS40Njg3NS40Njg3NS0uNDY4NzUgMS4xMzEyNSAwIC42NjI1LjQ2ODc1IDEuMTMxMjUuNDY4NzUuNDY4NzUgMS4xMzEyNS40Njg3NS42NjI1IDAgMS4xMzEyNS0uNDY4NzUuNDY4NzUtLjQ2ODc1LjQ2ODc1LTEuMTMxMjV6bTQuOCAzLjJxMC0uMzI1LS4yMzc1LS41NjI1LS4yMzc1LS4yMzc1LS41NjI1LS4yMzc1LS4zMjUgMC0uNTYyNS4yMzc1LS4yMzc1LjIzNzUtLjIzNzUuNTYyNSAwIC4zMzEyNS4yMzQzOC41NjU2Mi4yMzQzNy4yMzQzOC41NjU2Mi4yMzQzOC4zMzEyNSAwIC41NjU2Mi0uMjM0MzguMjM0MzgtLjIzNDM3LjIzNDM4LS41NjU2MnptMC02LjRxMC0uMzI1LS4yMzc1LS41NjI1LS4yMzc1LS4yMzc1LS41NjI1LS4yMzc1LS4zMjUgMC0uNTYyNS4yMzc1LS4yMzc1LjIzNzUtLjIzNzUuNTYyNSAwIC4zMzEyNS4yMzQzOC41NjU2My4yMzQzNy4yMzQzNy41NjU2Mi4yMzQzNy4zMzEyNSAwIC41NjU2Mi0uMjM0MzcuMjM0MzgtLjIzNDM4LjIzNDM4LS41NjU2M3ptLTIuNCAyLjYzMTI1djEuMTU2MjVxMCAuMDYyNS0uMDQzOC4xMjE4OC0uMDQzOC4wNTk0LS4xLjA2NTZsLS45Njg3NS4xNXEtLjA2ODguMjE4NzUtLjIuNDc1LjIxMjUuMy41NjI1LjcxODc1LjA0MzguMDYyNS4wNDM4LjEyNSAwIC4wNzUtLjA0MzguMTE4NzUtLjE0Mzc1LjE4NzUtLjUxNTYzLjU1OTM3LS4zNzE4Ny4zNzE4OC0uNDkwNjIuMzcxODgtLjA2ODggMC0uMTMxMjUtLjA0MzhsLS43MTg3NS0uNTYyNXEtLjIzMTI1LjExODc1LS40ODEyNS4xOTM3NS0uMDY4Ny42NzUtLjE0Mzc1Ljk2ODc1LS4wNDM4LjE1LS4xODc1LjE1aC0xLjE2MjVxLS4wNjg4IDAtLjEyNS0uMDQ2OS0uMDU2My0uMDQ2OS0uMDYyNS0uMTA5MzhsLS4xNDM3NS0uOTU2MjVxLS4yMTI1LS4wNjI1LS40Njg3NS0uMTkzNzVsLS43Mzc1LjU1NjI1cS0uMDQzNy4wNDM4LS4xMjUuMDQzOC0uMDY4NyAwLS4xMzEyNS0uMDUtLjktLjgzMTI1LS45LTEgMC0uMDU2My4wNDM3NS0uMTE4NzUuMDYyNS0uMDg3NS4yNTYyNS0uMzMxMjUuMTkzNzUtLjI0Mzc1LjI5Mzc1LS4zODEyNS0uMTQzNzUtLjI3NS0uMjE4NzUtLjUxMjVsLS45NS0uMTVxLS4wNjI1LS4wMDYtLjEwNjI1LS4wNTk0LS4wNDM3LS4wNTMwNS0uMDQzNy0uMTIxOHYtMS4xNTYyNXEwLS4wNjI1LjA0Mzc1LS4xMjE4OC4wNDM3NS0uMDU5NC4xLS4wNjU2bC45Njg3NS0uMTVxLjA2ODgtLjIxODc1LjItLjQ3NS0uMjEyNS0uMy0uNTYyNS0uNzE4NzUtLjA0Mzc1LS4wNjg4LS4wNDM3NS0uMTI1IDAtLjA3NS4wNDM3NS0uMTI1LjEzNzUtLjE4NzUuNTEyNS0uNTU2MjUuMzc1LS4zNjg3NS40OTM3NS0uMzY4NzUuMDY4OCAwIC4xMzEyNS4wNDM3bC43MTg3NS41NjI1cS4yMTI1LS4xMTI1LjQ4MTI1LS4yLjA2ODctLjY3NS4xNDM3NS0uOTYyNS4wNDM4LS4xNS4xODc1LS4xNWgxLjE2MjVxLjA2ODggMCAuMTI1LjA0NjkuMDU2My4wNDY5LjA2MjUuMTA5MzdsLjE0Mzc1Ljk1NjI1cS4yMTI1LjA2MjUuNDY4NzUuMTkzNzVsLjczNzUtLjU1NjI1cS4wNS0uMDQzNy4xMjUtLjA0MzcuMDY4NyAwIC4xMzEyNS4wNS45LjgzMTI1LjkgMSAwIC4wNTYyLS4wNDM4LjExODc1LS4wNzUuMS0uMjYyNS4zMzc1LS4xODc1LjIzNzUtLjI4MTI1LjM3NS4xNDM3NS4zLjIxMjUuNTEyNWwuOTUuMTQzNzVxLjA2MjUuMDEyNS4xMDYyNS4wNjU2LjA0MzguMDUzMS4wNDM4LjEyMTg3em00IDMuMzMxMjV2Ljg3NXEwIC4xLS45MzEyNS4xOTM3NS0uMDc1LjE2ODc1LS4xODc1LjMyNS4zMTg3NS43MDYyNS4zMTg3NS44NjI1IDAgLjAyNS0uMDI1LjA0MzctLjc2MjUuNDQzNzUtLjc3NS40NDM3NS0uMDUgMC0uMjg3NS0uMjkzNzUtLjIzNzUtLjI5Mzc1LS4zMjUtLjQyNS0uMTI1LjAxMjUtLjE4NzUuMDEyNS0uMDYyNSAwLS4xODc1LS4wMTI1LS4wODc1LjEzMTI1LS4zMjUuNDI1LS4yMzc1LjI5Mzc1LS4yODc1LjI5Mzc1LS4wMTI1IDAtLjc3NS0uNDQzNzUtLjAyNS0uMDE4Ny0uMDI1LS4wNDM3IDAtLjE1NjI1LjMxODc1LS44NjI1LS4xMTI1LS4xNTYyNS0uMTg3NS0uMzI1LS45MzEyNS0uMDkzNy0uOTMxMjUtLjE5Mzc1di0uODc1cTAtLjEuOTMxMjUtLjE5Mzc1LjA4MTMtLjE4MTI1LjE4NzUtLjMyNS0uMzE4NzUtLjcwNjI1LS4zMTg3NS0uODYyNSAwLS4wMjUuMDI1LS4wNDM4LjAyNS0uMDEyNS4yMTg3NS0uMTI1LjE5Mzc1LS4xMTI1LjM2ODc1LS4yMTI1LjE3NS0uMS4xODc1LS4xLjA1IDAgLjI4NzUuMjkwNjMuMjM3NS4yOTA2Mi4zMjUuNDIxODcuMTI1LS4wMTI1LjE4NzUtLjAxMjUuMDYyNSAwIC4xODc1LjAxMjUuMzE4NzUtLjQ0Mzc1LjU3NS0uN2wuMDM3NS0uMDEyNXEuMDI1IDAgLjc3NS40Mzc1LjAyNS4wMTg4LjAyNS4wNDM4IDAgLjE1NjI1LS4zMTg3NS44NjI1LjEwNjI1LjE0Mzc1LjE4NzUuMzI1LjkzMTI1LjA5MzcuOTMxMjUuMTkzNzV6bTAtNi40di44NzVxMCAuMS0uOTMxMjUuMTkzNzUtLjA3NS4xNjg3NS0uMTg3NS4zMjUuMzE4NzUuNzA2MjUuMzE4NzUuODYyNSAwIC4wMjUtLjAyNS4wNDM4LS43NjI1LjQ0Mzc1LS43NzUuNDQzNzUtLjA1IDAtLjI4NzUtLjI5Mzc1LS4yMzc1LS4yOTM3NS0uMzI1LS40MjUtLjEyNS4wMTI1LS4xODc1LjAxMjUtLjA2MjUgMC0uMTg3NS0uMDEyNS0uMDg3NS4xMzEyNS0uMzI1LjQyNS0uMjM3NS4yOTM3NS0uMjg3NS4yOTM3NS0uMDEyNSAwLS43NzUtLjQ0Mzc1LS4wMjUtLjAxODgtLjAyNS0uMDQzOCAwLS4xNTYyNS4zMTg3NS0uODYyNS0uMTEyNS0uMTU2MjUtLjE4NzUtLjMyNS0uOTMxMjUtLjA5MzctLjkzMTI1LS4xOTM3NXYtLjg3NXEwLS4xLjkzMTI1LS4xOTM3NS4wODEzLS4xODEyNS4xODc1LS4zMjUtLjMxODc1LS43MDYyNS0uMzE4NzUtLjg2MjUgMC0uMDI1LjAyNS0uMDQzOC4wMjUtLjAxMjUuMjE4NzUtLjEyNS4xOTM3NS0uMTEyNS4zNjg3NS0uMjEyNS4xNzUtLjEuMTg3NS0uMS4wNSAwIC4yODc1LjI5MDYyLjIzNzUuMjkwNjMuMzI1LjQyMTg4LjEyNS0uMDEyNS4xODc1LS4wMTI1LjA2MjUgMCAuMTg3NS4wMTI1LjMxODc1LS40NDM3NS41NzUtLjdsLjAzNzUtLjAxMjVxLjAyNSAwIC43NzUuNDM3NS4wMjUuMDE4OC4wMjUuMDQzOCAwIC4xNTYyNS0uMzE4NzUuODYyNS4xMDYyNS4xNDM3NS4xODc1LjMyNS45MzEyNS4wOTM3LjkzMTI1LjE5Mzc1elwiLz48L3N2Zz5cclxuICAgIHsvaWZ9ICAgIFxyXG4gICAgeyNpZiBuYW1lPT09XCJjbG9zZVwifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTEyIDEwLjA0NzE0MnEwIC4zMzY3LS4yMzU2OTIuNTcyMzgzbC0xLjE0NDc4MyAxLjE0NDc4M3EtLjIzNTY4My4yMzU2OTItLjU3MjM4My4yMzU2OTItLjMzNjcwMDMgMC0uNTcyMzkyLS4yMzU2OTJsLTIuNDc0NzUtMi40NzQ3NS0yLjQ3NDc1IDIuNDc0NzVxLS4yMzU2OTE3LjIzNTY5Mi0uNTcyMzkxNy4yMzU2OTItLjMzNjcgMC0uNTcyMzgzMy0uMjM1NjkybC0xLjE0NDc4MzMtMS4xNDQ3ODNxLS4yMzU2OTE3LS4yMzU2ODMtLjIzNTY5MTctLjU3MjM4MyAwLS4zMzY3LjIzNTY5MTctLjU3MjM5MmwyLjQ3NDc1LTIuNDc0NzUtMi40NzQ3NS0yLjQ3NDc1cS0uMjM1NjkxNy0uMjM1NjkxNy0uMjM1NjkxNy0uNTcyMzkxNyAwLS4zMzY3LjIzNTY5MTctLjU3MjM4MzNsMS4xNDQ3ODMzLTEuMTQ0NzgzM3EuMjM1NjgzMy0uMjM1NjkxNy41NzIzODMzLS4yMzU2OTE3LjMzNjcgMCAuNTcyMzkxNy4yMzU2OTE3bDIuNDc0NzUgMi40NzQ3NSAyLjQ3NDc1LTIuNDc0NzVxLjIzNTY5MTctLjIzNTY5MTcuNTcyMzkyLS4yMzU2OTE3LjMzNjcgMCAuNTcyMzgzLjIzNTY5MTdsMS4xNDQ3ODMgMS4xNDQ3ODMzcS4yMzU2OTIuMjM1NjgzMy4yMzU2OTIuNTcyMzgzMyAwIC4zMzY3LS4yMzU2OTIuNTcyMzkxN2wtMi40NzQ3NDk3IDIuNDc0NzUgMi40NzQ3NDk3IDIuNDc0NzVxLjIzNTY5Mi4yMzU2OTIuMjM1NjkyLjU3MjM5MnpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJkZWxldGVcIn1cclxuICAgICAgICA8c3ZnIHdpZHRoPVwiMjRweFwiIGhlaWdodD1cIjI0cHhcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgc3Ryb2tlPVwiI2ZmZmZmZlwiPjxnIGlkPVwiU1ZHUmVwb19iZ0NhcnJpZXJcIiBzdHJva2Utd2lkdGg9XCIwXCI+PC9nPjxnIGlkPVwiU1ZHUmVwb190cmFjZXJDYXJyaWVyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9nPjxnIGlkPVwiU1ZHUmVwb19pY29uQ2FycmllclwiPiA8cGF0aCBkPVwiTTE4IDZWMTYuMkMxOCAxNy44ODAyIDE4IDE4LjcyMDIgMTcuNjczIDE5LjM2MkMxNy4zODU0IDE5LjkyNjUgMTYuOTI2NSAyMC4zODU0IDE2LjM2MiAyMC42NzNDMTUuNzIwMiAyMSAxNC44ODAyIDIxIDEzLjIgMjFIMTAuOEM5LjExOTg0IDIxIDguMjc5NzYgMjEgNy42MzgwMyAyMC42NzNDNy4wNzM1NCAyMC4zODU0IDYuNjE0NiAxOS45MjY1IDYuMzI2OTggMTkuMzYyQzYgMTguNzIwMiA2IDE3Ljg4MDIgNiAxNi4yVjZNNCA2SDIwTTE2IDZMMTUuNzI5NCA1LjE4ODA3QzE1LjQ2NzEgNC40MDEyNSAxNS4zMzU5IDQuMDA3ODQgMTUuMDkyNyAzLjcxNjk4QzE0Ljg3NzkgMy40NjAxMyAxNC42MDIxIDMuMjYxMzIgMTQuMjkwNSAzLjEzODc4QzEzLjkzNzYgMyAxMy41MjMgMyAxMi42OTM2IDNIMTEuMzA2NEMxMC40NzcgMyAxMC4wNjI0IDMgOS43MDk1MSAzLjEzODc4QzkuMzk3OTIgMy4yNjEzMiA5LjEyMjA4IDMuNDYwMTMgOC45MDcyOSAzLjcxNjk4QzguNjY0MDUgNC4wMDc4NCA4LjUzMjkyIDQuNDAxMjUgOC4yNzA2NCA1LjE4ODA3TDggNlwiIHN0cm9rZT1cIiNmZmZmZmZmZlwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+IDwvZz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImVycm9ybG9nc1wifVxyXG4gICAgICAgIDxzdmcgd2lkdGg9XCIyNHB4XCIgaGVpZ2h0PVwiMjRweFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48ZyBpZD1cIlNWR1JlcG9fYmdDYXJyaWVyXCIgc3Ryb2tlLXdpZHRoPVwiMFwiPjwvZz48ZyBpZD1cIlNWR1JlcG9fdHJhY2VyQ2FycmllclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvZz48ZyBpZD1cIlNWR1JlcG9faWNvbkNhcnJpZXJcIj4gPGcgaWQ9XCJXYXJuaW5nIC8gV2FybmluZ1wiPiA8cGF0aCBpZD1cIlZlY3RvclwiIGQ9XCJNMTIgNlYxNE0xMi4wNDk4IDE4VjE4LjFMMTEuOTUwMiAxOC4xMDAyVjE4SDEyLjA0OThaXCIgc3Ryb2tlPVwiI2ZmZmZmZlwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+IDwvZz4gPC9nPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuXHJcbiAgICB7I2lmIG5hbWU9PT1cImFycm93UmlnaHRcIn1cclxuICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMTQgMTRcIiAgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtOC41Nzg5NDcgMy4zMDU1MXYyLjQzMTMzMmgtNy41Nzg5NDd2Mi41MjYzMTZoNy41Nzg5NDd2Mi40MzEzMzJsNC40MjEwNTMtMy42OTQ0OXpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJyZW1vdmVGcm9tTGlzdFwifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgc3R5bGU9XCJmaWxsOnJlZFwiPjxwYXRoIGQ9XCJtNS40OTk5Mzc3IDUuNzUwMTk3OXY0LjUwMDE4NzFxMCAuMTA5NTA1LS4wNzA1MDMuMTc5NTA4LS4wNzA1MDMuMDctLjE3OTUwNzQuMDcwNWgtLjUwMDAyMDlxLS4xMDk1MDQ1IDAtLjE3OTUwNzUtLjA3MDUtLjA3MDAwMy0uMDcwNS0uMDcwNTAzLS4xNzk1MDh2LTQuNTAwMTg3MXEwLS4xMDk1MDQ1LjA3MDUwMy0uMTc5NTA3NS4wNzA1MDMtLjA3MDAwMy4xNzk1MDc1LS4wNzA1MDNoLjUwMDAyMDlxLjEwOTUwNDUgMCAuMTc5NTA3NC4wNzA1MDMuMDcwMDAzLjA3MDUwMy4wNzA1MDMuMTc5NTA3NXptMi4wMDAwODMzIDB2NC41MDAxODcxcTAgLjEwOTUwNS0uMDcwNTAzLjE3OTUwOC0uMDcwNTAzLjA3LS4xNzk1MDc1LjA3MDVoLS41MDAwMjA3cS0uMTA5NTA0NiAwLS4xNzk1MDc1LS4wNzA1LS4wNzAwMDMtLjA3MDUtLjA3MDUwMy0uMTc5NTA4di00LjUwMDE4NzFxMC0uMTA5NTA0NS4wNzA1MDMtLjE3OTUwNzUuMDcwNTAzLS4wNzAwMDMuMTc5NTA3NS0uMDcwNTAzaC41MDAwMjA4cS4xMDk1MDQ2IDAgLjE3OTUwNzUuMDcwNTAzLjA3MDAwMy4wNzA1MDMuMDcwNTAzLjE3OTUwNzV6bTIuMDAwMDgzMyAwdjQuNTAwMTg3MXEwIC4xMDk1MDUtLjA3MDUwMy4xNzk1MDgtLjA3MDUwMy4wNy0uMTc5NTA3NS4wNzA1aC0uNTAwMDIwN3EtLjEwOTUwNDYgMC0uMTc5NTA3NS0uMDcwNS0uMDcwMDAzLS4wNzA1LS4wNzA1MDMtLjE3OTUwOHYtNC41MDAxODcxcTAtLjEwOTUwNDUuMDcwNTAzLS4xNzk1MDc1LjA3MDUwMy0uMDcwMDAzLjE3OTUwNzUtLjA3MDUwM2guNTAwMDIwOXEuMTA5NTA0NiAwIC4xNzk1MDc1LjA3MDUwMy4wNzAwMDMuMDcwNTAzLjA3MDUwMy4xNzk1MDc1em0xLjAwMDA0MTcgNS42NTY3MzYxdi03LjQwNjMwOWgtNy4wMDAyOTE3djcuNDA2MzA5cTAgLjE3MjAwNy4wNTQ1MDIuMzE2NTEzLjA1NDUwMi4xNDQ1MDYuMTEzNTA0Ny4yMTEwMDkuMDU5MDAzLjA2NjUuMDgyMDA0LjA2NjVoNi41MDAyNzFxLjAyMzUgMCAuMDgyLS4wNjY1LjA1ODUtLjA2NjUuMTEzNTA0LS4yMTEwMDkuMDU1LS4xNDQ1MDYuMDU0NS0uMzE2NTEzem0tNS4yNTAyMTg3LTguNDA2ODUwN2gzLjUwMDE0NThsLS4zNzUwMTU2LS45MTQwMzhxLS4wNTQ1MDIzLS4wNzA1MDMtLjEzMzAwNTYtLjA4NjAwMzZoLTIuNDc2NjAzMnEtLjA3ODAwMy4wMTU1MDEtLjEzMzAwNTUuMDg2MDA0em03LjI1MDMwMTcuMjUwMDEwNXYuNTAwMDIwOHEwIC4xMDk1MDQ2LS4wNzA1LjE3OTUwNzUtLjA3MDUuMDcwMDAzLS4xNzk1MDcuMDcwNTAzaC0uNzUwMDMxdjcuNDA2MzA4OXEwIC42NDg1MjctLjM2NzAxNiAxLjEyMTA0Ni0uMzY3MDE4LjQ3MjUyLS44ODMwMzkuNDcyNTJoLTYuNTAwMjcxMnEtLjUxNTUyMTUgMC0uODgzMDM2OC0uNDU3MDE5LS4zNjc1MTU0LS40NTcwMTktLjM2NzAxNTMtMS4xMDU1NDZ2LTcuNDM3ODFoLS43NTAwMzEzcS0uMTA5NTA0NiAwLS4xNzk1MDc1LS4wNzA1MDMtLjA3MDAwMjktLjA3MDUwMjktLjA3MDUwMjktLjE3OTUwNzR2LS41MDAwMjA5cTAtLjEwOTUwNDUuMDcwNTAzLS4xNzk1MDc0LjA3MDUwMy0uMDcwMDAzLjE3OTUwNzUtLjA3MDUwM2gyLjQxNDEwMDVsLjU0NzAyMjgtMS4zMDQ1NTQzcS4xMTcwMDQ5LS4yODkwMTIxLjQyMjAxNzYtLjQ5MjAyMDUuMzA1MDEyNy0uMjAzMDA4NS42MTcwMjU3LS4yMDMwMDg1aDIuNTAwMTA0MnEuMzEyNTEzIDAgLjYxNzAyNTcuMjAzMDA4NS4zMDQ1MTI3LjIwMzAwODQuNDIyMDE3Ni40OTIwMjA1bC41NDcwMjI3IDEuMzA0NTU0M2gyLjQxNDEwMDdxLjEwOTUwNCAwIC4xNzk1MDcuMDcwNTAzLjA3LjA3MDUwMy4wNzA1LjE3OTUwNzR6XCIvPjwvc3ZnPiAgICBcclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImNvbWJvTGlzdFwifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiICB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIm0xIDIuOGgxMnYxLjJoLTEyem0wIDIuNGgxMnYxLjJoLTEyem0wIDIuNGgxMnYxLjJoLTEyem0wIDIuNGgxMnYxLjJoLTEyelwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImZvcm1fdGV4dFwifVxyXG4gICAgPHN2ZyAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiICB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiID5cclxuICAgICAgICA8cGF0aCB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZD1cIk0xMCA1aDRhMSAxIDAgMCAxIDEgMXY0YTEgMSAwIDAgMS0xIDFoLTR2MWg0YTIgMiAwIDAgMCAyLTJWNmEyIDIgMCAwIDAtMi0yaC00djF6TTYgNVY0SDJhMiAyIDAgMCAwLTIgMnY0YTIgMiAwIDAgMCAyIDJoNHYtMUgyYTEgMSAwIDAgMS0xLTFWNmExIDEgMCAwIDEgMS0xaDR6XCI+PC9wYXRoPlxyXG4gICAgICAgIDxwYXRoIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk04IDFhLjUuNSAwIDAgMSAuNS41djEzYS41LjUgMCAwIDEtMSAwdi0xM0EuNS41IDAgMCAxIDggMXpcIj48L3BhdGg+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgey9pZn1cclxuXHJcbiAgICB7I2lmIG5hbWU9PT1cImZvcm1fdGV4dF9vdXRwdXRcIn1cclxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiAgdmlld0JveD1cIjAgMCAxNiAxNlwiPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNMTIuMjU4IDNoLTguNTFsLS4wODMgMi40NmguNDc5Yy4yNi0xLjU0NC43NTgtMS43ODMgMi42OTMtMS44NDVsLjQyNC0uMDEzdjcuODI3YzAgLjY2My0uMTQ0LjgyLTEuMy45MjN2LjUyaDQuMDgydi0uNTJjLTEuMTYyLS4xMDMtMS4zMDYtLjI2LTEuMzA2LS45MjNWMy42MDJsLjQzMS4wMTNjMS45MzQuMDYyIDIuNDM0LjMwMSAyLjY5MyAxLjg0NmguNDc5elwiLz5cclxuICAgICAgPC9zdmc+XHJcbiAgICAgIHsvaWZ9XHJcblxyXG4gICAgeyNpZiBuYW1lPT09XCJmb3JtX3RleHRhcmVhXCJ9XHJcbiAgICAgICAgPHN2ZyAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiICB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgIGZpbGw9XCJjdXJyZW50Q29sb3JcIiA+PHBhdGggeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGQ9XCJNMCA0LjVBMi41IDIuNSAwIDAgMSAyLjUgMmgxMUEyLjUgMi41IDAgMCAxIDE2IDQuNXY3YTIuNSAyLjUgMCAwIDEtMi41IDIuNWgtMTFBMi41IDIuNSAwIDAgMSAwIDExLjV2LTd6TTIuNSAzQTEuNSAxLjUgMCAwIDAgMSA0LjV2N0ExLjUgMS41IDAgMCAwIDIuNSAxM2gxMWExLjUgMS41IDAgMCAwIDEuNS0xLjV2LTdBMS41IDEuNSAwIDAgMCAxMy41IDNoLTExem0xMC44NTQgNC42NDZhLjUuNSAwIDAgMSAwIC43MDhsLTMgM2EuNS41IDAgMCAxLS43MDgtLjcwOGwzLTNhLjUuNSAwIDAgMSAuNzA4IDB6bTAgMi41YS41LjUgMCAwIDEgMCAuNzA4bC0uNS41YS41LjUgMCAwIDEtLjcwOC0uNzA4bC41LS41YS41LjUgMCAwIDEgLjcwOCAwelwiPjwvcGF0aD48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImZvcm1fY2hlY2tib3hcIn1cclxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPjxwYXRoIGQ9XCJNNSAzYTUgNSAwIDAgMCAwIDEwaDZhNSA1IDAgMCAwIDAtMTB6bTYgOWE0IDQgMCAxIDEgMC04IDQgNCAwIDAgMSAwIDhcIi8+PC9zdmc+XHJcbiAgICB7L2lmfSAgICBcclxuICAgIHsjaWYgbmFtZT09PVwiZm9ybV9kcm9wZG93blwifVxyXG4gICAgPHN2ZyAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiICBmaWxsPVwiY3VycmVudENvbG9yXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiICA+XHJcbiAgICAgICAgPHBhdGggeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGQ9XCJNMCAxLjVBMS41IDEuNSAwIDAgMSAxLjUgMGg4QTEuNSAxLjUgMCAwIDEgMTEgMS41djJBMS41IDEuNSAwIDAgMSA5LjUgNWgtOEExLjUgMS41IDAgMCAxIDAgMy41di0yek0xLjUgMWEuNS41IDAgMCAwLS41LjV2MmEuNS41IDAgMCAwIC41LjVoOGEuNS41IDAgMCAwIC41LS41di0yYS41LjUgMCAwIDAtLjUtLjVoLTh6XCI+PC9wYXRoPlxyXG4gICAgICAgIDxwYXRoIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBkPVwibTcuODIzIDIuODIzLS4zOTYtLjM5NkEuMjUuMjUgMCAwIDEgNy42MDQgMmguNzkyYS4yNS4yNSAwIDAgMSAuMTc3LjQyN2wtLjM5Ni4zOTZhLjI1LjI1IDAgMCAxLS4zNTQgMHpNMCA4YTIgMiAwIDAgMSAyLTJoMTJhMiAyIDAgMCAxIDIgMnY1YTIgMiAwIDAgMS0yIDJIMmEyIDIgMCAwIDEtMi0yVjh6bTEgM3YyYTEgMSAwIDAgMCAxIDFoMTJhMSAxIDAgMCAwIDEtMXYtMkgxem0xNC0xVjhhMSAxIDAgMCAwLTEtMUgyYTEgMSAwIDAgMC0xIDF2MmgxNHpNMiA4LjVhLjUuNSAwIDAgMSAuNS0uNWg5YS41LjUgMCAwIDEgMCAxaC05YS41LjUgMCAwIDEtLjUtLjV6bTAgNGEuNS41IDAgMCAxIC41LS41aDZhLjUuNSAwIDAgMSAwIDFoLTZhLjUuNSAwIDAgMS0uNS0uNXpcIj48L3BhdGg+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgey9pZn0gICAgICBcclxuICAgIHsjaWYgbmFtZT09PVwiZm9ybV9zbGlkZXJcIn1cclxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPiAgICAgICA8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk0xMS41IDJhMS41IDEuNSAwIDEgMCAwIDMgMS41IDEuNSAwIDAgMCAwLTNNOS4wNSAzYTIuNSAyLjUgMCAwIDEgNC45IDBIMTZ2MWgtMi4wNWEyLjUgMi41IDAgMCAxLTQuOSAwSDBWM3pNNC41IDdhMS41IDEuNSAwIDEgMCAwIDMgMS41IDEuNSAwIDAgMCAwLTNNMi4wNSA4YTIuNSAyLjUgMCAwIDEgNC45IDBIMTZ2MUg2Ljk1YTIuNSAyLjUgMCAwIDEtNC45IDBIMFY4em05LjQ1IDRhMS41IDEuNSAwIDEgMCAwIDMgMS41IDEuNSAwIDAgMCAwLTNtLTIuNDUgMWEyLjUgMi41IDAgMCAxIDQuOSAwSDE2djFoLTIuMDVhMi41IDIuNSAwIDAgMS00LjkgMEgwdi0xelwiLz4gICAgICA8L3N2Zz5cclxuICAgIHsvaWZ9ICAgICAgXHJcbiAgICB7I2lmIG5hbWU9PT1cImZvcm1fbGF5ZXJzXCJ9XHJcbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj48cGF0aCBkPVwiTTguMjM1IDEuNTU5YS41LjUgMCAwIDAtLjQ3IDBsLTcuNSA0YS41LjUgMCAwIDAgMCAuODgyTDMuMTg4IDggLjI2NCA5LjU1OWEuNS41IDAgMCAwIDAgLjg4Mmw3LjUgNGEuNS41IDAgMCAwIC40NyAwbDcuNS00YS41LjUgMCAwIDAgMC0uODgyTDEyLjgxMyA4bDIuOTIyLTEuNTU5YS41LjUgMCAwIDAgMC0uODgyem0zLjUxNSA3LjAwOEwxNC40MzggMTAgOCAxMy40MzMgMS41NjIgMTAgNC4yNSA4LjU2N2wzLjUxNSAxLjg3NGEuNS41IDAgMCAwIC40NyAwek04IDkuNDMzIDEuNTYyIDYgOCAyLjU2NyAxNC40MzggNnpcIi8+ICAgICAgICA8L3N2Zz5cclxuICAgIHsvaWZ9ICAgICAgXHJcbiAgICB7I2lmIG5hbWU9PT1cImZvcm1fbGF5ZXJzMlwifVxyXG4gICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiAgdmlld0JveD1cIjAgMCAxNiAxNlwiPjxwYXRoIGQ9XCJNOC4yMzUgMS41NTlhLjUuNSAwIDAgMC0uNDcgMGwtNy41IDRhLjUuNSAwIDAgMCAwIC44ODJMMy4xODggOCAuMjY0IDkuNTU5YS41LjUgMCAwIDAgMCAuODgybDcuNSA0YS41LjUgMCAwIDAgLjQ3IDBsNy41LTRhLjUuNSAwIDAgMCAwLS44ODJMMTIuODEzIDhsMi45MjItMS41NTlhLjUuNSAwIDAgMCAwLS44ODJ6TTggOS40MzMgMS41NjIgNiA4IDIuNTY3IDE0LjQzOCA2elwiLz48L3N2Zz5cclxuICAgIHsvaWZ9ICAgICAgXHJcbiAgICB7I2lmIG5hbWU9PT1cImZvcm1fcHJldmlld1wifVxyXG4gICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiICB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+XHJcbiAgICAgICAgPHBhdGggZD1cIk02LjUgNC40ODJjMS42NjQtMS42NzMgNS44MjUgMS4yNTQgMCA1LjAxOC01LjgyNS0zLjc2NC0xLjY2NC02LjY5IDAtNS4wMThcIi8+XHJcbiAgICAgICAgPHBhdGggZD1cIk0xMyA2LjVhNi40NyA2LjQ3IDAgMCAxLTEuMjU4IDMuODQ0cS4wNi4wNDQuMTE1LjA5OGwzLjg1IDMuODVhMSAxIDAgMCAxLTEuNDE0IDEuNDE1bC0zLjg1LTMuODVhMSAxIDAgMCAxLS4xLS4xMTVoLjAwMkE2LjUgNi41IDAgMSAxIDEzIDYuNU02LjUgMTJhNS41IDUuNSAwIDEgMCAwLTExIDUuNSA1LjUgMCAwIDAgMCAxMVwiLz5cclxuICAgICAgPC9zdmc+XHJcbiAgICB7L2lmfSAgIFxyXG4gICAgeyNpZiBuYW1lPT09XCJmb3JtX2xheWVyczNcIn1cclxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiICBmaWxsPVwiY3VycmVudENvbG9yXCIgIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj5cclxuICAgICAgICA8cGF0aCBkPVwiTTcuNzY1IDEuNTU5YS41LjUgMCAwIDEgLjQ3IDBsNy41IDRhLjUuNSAwIDAgMSAwIC44ODJsLTcuNSA0YS41LjUgMCAwIDEtLjQ3IDBsLTcuNS00YS41LjUgMCAwIDEgMC0uODgyelwiLz5cclxuICAgICAgICA8cGF0aCBkPVwibTIuMTI1IDguNTY3LTEuODYuOTkyYS41LjUgMCAwIDAgMCAuODgybDcuNSA0YS41LjUgMCAwIDAgLjQ3IDBsNy41LTRhLjUuNSAwIDAgMCAwLS44ODJsLTEuODYtLjk5Mi01LjE3IDIuNzU2YTEuNSAxLjUgMCAwIDEtMS40MSAwelwiLz5cclxuICAgICAgPC9zdmc+ICAgXHJcbiAgICAgIHsvaWZ9XHJcbiAgICAgIHsjaWYgbmFtZT09XCJmb3JtX2FkdmFuY2VkXCJ9XHJcbiAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiICBmaWxsPVwiY3VycmVudENvbG9yXCIgIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj5cclxuICAgICAgICA8cGF0aCBkPVwiTTggNC43NTRhMy4yNDYgMy4yNDYgMCAxIDAgMCA2LjQ5MiAzLjI0NiAzLjI0NiAwIDAgMCAwLTYuNDkyTTUuNzU0IDhhMi4yNDYgMi4yNDYgMCAxIDEgNC40OTIgMCAyLjI0NiAyLjI0NiAwIDAgMS00LjQ5MiAwXCIvPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNOS43OTYgMS4zNDNjLS41MjctMS43OS0zLjA2NS0xLjc5LTMuNTkyIDBsLS4wOTQuMzE5YS44NzMuODczIDAgMCAxLTEuMjU1LjUybC0uMjkyLS4xNmMtMS42NC0uODkyLTMuNDMzLjkwMi0yLjU0IDIuNTQxbC4xNTkuMjkyYS44NzMuODczIDAgMCAxLS41MiAxLjI1NWwtLjMxOS4wOTRjLTEuNzkuNTI3LTEuNzkgMy4wNjUgMCAzLjU5MmwuMzE5LjA5NGEuODczLjg3MyAwIDAgMSAuNTIgMS4yNTVsLS4xNi4yOTJjLS44OTIgMS42NC45MDEgMy40MzQgMi41NDEgMi41NGwuMjkyLS4xNTlhLjg3My44NzMgMCAwIDEgMS4yNTUuNTJsLjA5NC4zMTljLjUyNyAxLjc5IDMuMDY1IDEuNzkgMy41OTIgMGwuMDk0LS4zMTlhLjg3My44NzMgMCAwIDEgMS4yNTUtLjUybC4yOTIuMTZjMS42NC44OTMgMy40MzQtLjkwMiAyLjU0LTIuNTQxbC0uMTU5LS4yOTJhLjg3My44NzMgMCAwIDEgLjUyLTEuMjU1bC4zMTktLjA5NGMxLjc5LS41MjcgMS43OS0zLjA2NSAwLTMuNTkybC0uMzE5LS4wOTRhLjg3My44NzMgMCAwIDEtLjUyLTEuMjU1bC4xNi0uMjkyYy44OTMtMS42NC0uOTAyLTMuNDMzLTIuNTQxLTIuNTRsLS4yOTIuMTU5YS44NzMuODczIDAgMCAxLTEuMjU1LS41MnptLTIuNjMzLjI4M2MuMjQ2LS44MzUgMS40MjgtLjgzNSAxLjY3NCAwbC4wOTQuMzE5YTEuODczIDEuODczIDAgMCAwIDIuNjkzIDEuMTE1bC4yOTEtLjE2Yy43NjQtLjQxNSAxLjYuNDIgMS4xODQgMS4xODVsLS4xNTkuMjkyYTEuODczIDEuODczIDAgMCAwIDEuMTE2IDIuNjkybC4zMTguMDk0Yy44MzUuMjQ2LjgzNSAxLjQyOCAwIDEuNjc0bC0uMzE5LjA5NGExLjg3MyAxLjg3MyAwIDAgMC0xLjExNSAyLjY5M2wuMTYuMjkxYy40MTUuNzY0LS40MiAxLjYtMS4xODUgMS4xODRsLS4yOTEtLjE1OWExLjg3MyAxLjg3MyAwIDAgMC0yLjY5MyAxLjExNmwtLjA5NC4zMThjLS4yNDYuODM1LTEuNDI4LjgzNS0xLjY3NCAwbC0uMDk0LS4zMTlhMS44NzMgMS44NzMgMCAwIDAtMi42OTItMS4xMTVsLS4yOTIuMTZjLS43NjQuNDE1LTEuNi0uNDItMS4xODQtMS4xODVsLjE1OS0uMjkxQTEuODczIDEuODczIDAgMCAwIDEuOTQ1IDguOTNsLS4zMTktLjA5NGMtLjgzNS0uMjQ2LS44MzUtMS40MjggMC0xLjY3NGwuMzE5LS4wOTRBMS44NzMgMS44NzMgMCAwIDAgMy4wNiA0LjM3N2wtLjE2LS4yOTJjLS40MTUtLjc2NC40Mi0xLjYgMS4xODUtMS4xODRsLjI5Mi4xNTlhMS44NzMgMS44NzMgMCAwIDAgMi42OTItMS4xMTV6XCIvPlxyXG4gICAgICA8L3N2Zz5cclxuICAgICAgey9pZn1cclxuICAgICAgeyNpZiBuYW1lPT1cImZvcm1fY29sb3JwaWNrZXJcIn1cclxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPlxyXG4gICAgICAgICAgICA8cGF0aCBkPVwiTTEzLjM1NC42NDZhMS4yMDcgMS4yMDcgMCAwIDAtMS43MDggMEw4LjUgMy43OTNsLS42NDYtLjY0N2EuNS41IDAgMSAwLS43MDguNzA4TDguMjkzIDVsLTcuMTQ3IDcuMTQ2QS41LjUgMCAwIDAgMSAxMi41djEuNzkzbC0uODU0Ljg1M2EuNS41IDAgMSAwIC43MDguNzA3TDEuNzA3IDE1SDMuNWEuNS41IDAgMCAwIC4zNTQtLjE0NkwxMSA3LjcwN2wxLjE0NiAxLjE0N2EuNS41IDAgMCAwIC43MDgtLjcwOGwtLjY0Ny0uNjQ2IDMuMTQ3LTMuMTQ2YTEuMjA3IDEuMjA3IDAgMCAwIDAtMS43MDh6TTIgMTIuNzA3bDctN0wxMC4yOTMgN2wtNyA3SDJ6XCIvPlxyXG4gICAgICAgIDwvc3ZnPlxyXG4gICAgICAgey9pZn1cclxuICAgICAgIHsjaWYgbmFtZT09XCJmb3JtX21hZ25pZmllclwifSBcclxuICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+XHJcbiAgICAgICAgPHBhdGggZD1cIk0xMS43NDIgMTAuMzQ0YTYuNSA2LjUgMCAxIDAtMS4zOTcgMS4zOThoLS4wMDFxLjA0NC4wNi4wOTguMTE1bDMuODUgMy44NWExIDEgMCAwIDAgMS40MTUtMS40MTRsLTMuODUtMy44NWExIDEgMCAwIDAtLjExNS0uMXpNMTIgNi41YTUuNSA1LjUgMCAxIDEtMTEgMCA1LjUgNS41IDAgMCAxIDExIDBcIi8+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgICB7L2lmfVxyXG5cclxuICAgIHsjaWYgbmFtZT09XCJkZWFjdGl2YXRlZFwifVxyXG4gICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgNDggNDhcIiBmaWxsPVwibm9uZVwiPjxwYXRoIGQ9XCJNOCA4TDQwIDQwXCIgc3Ryb2tlPVwiI2ZmZmZmZlwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+PHBhdGggZD1cIk04IDQwTDQwIDhcIiBzdHJva2U9XCIjZmZmZmZmXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcblxyXG4gICAgeyNpZiBuYW1lPT1cImFjdGl2YXRlYmFja1wifVxyXG4gICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgNDggNDhcIiBmaWxsPVwibm9uZVwiPjxwYXRoIGQ9XCJNMTAgMzNDMTAgMjUuNzAxMSAxNC4xMDMgMTkuNDE2OCAyMCAxNi41OTE5QzIyLjEzNDcgMTUuNTY5MyAyNC41MDQ2IDE1IDI3IDE1QzM2LjM4ODggMTUgNDQgMjMuMDU4OSA0NCAzM1wiIHN0cm9rZT1cIiNmZmZmZmZcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjxwYXRoIGQ9XCJNMTggMjhMMTAgMzNMNCAyNVwiIHN0cm9rZT1cIiNmZmZmZmZcIiBzdHJva2Utd2lkdGg9XCI0XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuXHJcblxyXG5cclxuPC9kaXY+XHJcblxyXG48c3R5bGU+XHJcbiAgICAuZGVmYXVsdCB7XHJcbiAgICAgICAgZmlsbDogd2hpdGU7XHJcbiAgICAgICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyOyAgICAgICAgXHJcbiAgICAgICAgd2lkdGg6IDMwcHg7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgfVxyXG4gICAgLmRlZmF1bHQ6aG92ZXIsIC5hY3RpdmUge1xyXG4gICAgICAgIGZpbGw6IGJsYWNrO1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNkZGI3NGY7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgfSAgXHJcbiAgICAuZGVhY3RpdmF0ZSB7XHJcbiAgICAgICAgZmlsbDogZ3JleTtcclxuICAgICAgICBjdXJzb3I6IGRlZmF1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLmRlYWN0aXZhdGU6aG92ZXIge1xyXG4gICAgICAgIGZpbGw6IGdyZXk7XHJcbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLmRlZmF1bHQgc3ZnIHtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB9ICBcclxuICAgIC5sZWZ0TWVudUljb24ge1xyXG4gICAgICAgIHBhZGRpbmctdG9wOiA4cHg7XHJcbiAgICAgICAgaGVpZ2h0OiAzMHB4O1xyXG4gICAgfVxyXG4gICAgLmxlZnRNZW51SWNvbjIge1xyXG4gICAgICAgIHBhZGRpbmctdG9wOiA0cHg7XHJcbiAgICAgICAgaGVpZ2h0OiAzMHB4O1xyXG4gICAgfSAgICBcclxuICAgIC5sZWZ0TWVudUljb24zIHtcclxuICAgICAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICB9ICAgIFxyXG4gICAgLmxlZnRNZW51VG9wTWFyZ2luIHtcclxuICAgICAgICBtYXJnaW4tdG9wOiAyMHB4O1xyXG4gICAgfVxyXG4gICAgLm91dGVyIHtcclxuICAgICAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICB9XHJcbiAgICAuYXJyb3dSaWdodCB7XHJcbiAgICAgICAgZmlsbDogd2hpdGU7XHJcbiAgICAgICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgd2lkdGg6IDMwcHg7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiAtNXB4O1xyXG4gICAgfVxyXG4gICAgLmNvbWJvTGlzdCB7XHJcbiAgICAgICAgdmVydGljYWwtYWxpZ246IC00cHg7XHJcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDEwcHg7XHJcbiAgICB9XHJcbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXNMSSxvQ0FBUyxDQUNMLElBQUksQ0FBRSxLQUFLLENBQ1gsUUFBUSxZQUFZLENBQ3BCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsS0FBSyxDQUFFLElBQUksQ0FDWCxVQUFVLENBQUUsTUFDaEIsQ0FDQSxvQ0FBUSxNQUFNLENBQUUsbUNBQVEsQ0FDcEIsSUFBSSxDQUFFLEtBQUssQ0FDWCxnQkFBZ0IsQ0FBRSxPQUFPLENBQ3pCLGFBQWEsQ0FBRSxHQUNuQixDQUNBLHVDQUFZLENBQ1IsSUFBSSxDQUFFLElBQUksQ0FDVixNQUFNLENBQUUsT0FDWixDQUVBLHVDQUFXLE1BQU8sQ0FDZCxJQUFJLENBQUUsSUFBSSxDQUNWLFVBQVUsQ0FBRSxXQUNoQixDQUVBLHNCQUFRLENBQUMsaUJBQUksQ0FDVCxPQUFPLENBQUUsWUFDYixDQUNBLHlDQUFjLENBQ1YsV0FBVyxDQUFFLEdBQUcsQ0FDaEIsTUFBTSxDQUFFLElBQ1osQ0FDQSwwQ0FBZSxDQUNYLFdBQVcsQ0FBRSxHQUFHLENBQ2hCLE1BQU0sQ0FBRSxJQUNaLENBQ0EsMENBQWUsQ0FDWCxNQUFNLENBQUUsSUFDWixDQUNBLDhDQUFtQixDQUNmLFVBQVUsQ0FBRSxJQUNoQixDQUNBLGtDQUFPLENBQ0gsUUFBUSxZQUFZLENBQ3BCLE1BQU0sQ0FBRSxPQUNaLENBQ0EsdUNBQVksQ0FDUixJQUFJLENBQUUsS0FBSyxDQUNYLFFBQVEsWUFBWSxDQUNwQixLQUFLLENBQUUsSUFBSSxDQUNYLFVBQVUsQ0FBRSxNQUFNLENBQ2xCLGNBQWMsQ0FBRSxJQUNwQixDQUNBLHNDQUFXLENBQ1AsY0FBYyxDQUFFLElBQUksQ0FDcEIsV0FBVyxDQUFFLElBQ2pCIn0= */");
    }

    // (50:4) {#if svg}
    function create_if_block_30$1(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*svg*/ ctx[1], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*svg*/ 2) html_tag.p(/*svg*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_30$1.name,
    		type: "if",
    		source: "(50:4) {#if svg}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#if name==="move"}
    function create_if_block_29$1(ctx) {
    	let svg_1;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			attr_dev(path0, "d", "M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path0, file$7, 54, 8, 2668);
    			attr_dev(path1, "d", "M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path1, file$7, 55, 8, 2734);
    			attr_dev(path2, "d", "M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path2, file$7, 56, 8, 2801);
    			attr_dev(path3, "d", "M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path3, file$7, 57, 8, 2868);
    			attr_dev(path4, "d", "M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path4, file$7, 58, 8, 2935);
    			attr_dev(path5, "d", "M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path5, file$7, 59, 8, 3003);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "width", "20");
    			attr_dev(svg_1, "height", "20");
    			attr_dev(svg_1, "viewBox", "0 0 24 24");
    			attr_dev(svg_1, "fill", "none");
    			attr_dev(svg_1, "stroke", "#FFF");
    			attr_dev(svg_1, "stroke-width", "2");
    			attr_dev(svg_1, "stroke-linecap", "round");
    			attr_dev(svg_1, "stroke-linejoin", "round");
    			attr_dev(svg_1, "id", "dragModelManagerTopBarIcon");
    			attr_dev(svg_1, "cursor", "move");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 51, 8, 2419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path0);
    			append_dev(svg_1, path1);
    			append_dev(svg_1, path2);
    			append_dev(svg_1, path3);
    			append_dev(svg_1, path4);
    			append_dev(svg_1, path5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_29$1.name,
    		type: "if",
    		source: "(51:4) {#if name===\\\"move\\\"}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if name==="down"}
    function create_if_block_28$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z");
    			add_location(path, file$7, 63, 95, 3210);
    			attr_dev(svg_1, "viewBox", "0 0 320 512");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "width", "15");
    			attr_dev(svg_1, "height", "15");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 63, 8, 3123);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_28$1.name,
    		type: "if",
    		source: "(63:4) {#if name===\\\"down\\\"}",
    		ctx
    	});

    	return block;
    }

    // (66:4) {#if name==="up"}
    function create_if_block_27$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z");
    			add_location(path, file$7, 66, 95, 3564);
    			attr_dev(svg_1, "viewBox", "0 0 320 512");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "width", "15");
    			attr_dev(svg_1, "height", "15");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 66, 8, 3477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_27$1.name,
    		type: "if",
    		source: "(66:4) {#if name===\\\"up\\\"}",
    		ctx
    	});

    	return block;
    }

    // (69:4) {#if name==="save"}
    function create_if_block_26$1(ctx) {
    	let svg_1;
    	let path0;
    	let path1;
    	let path2;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "d", "M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2");
    			add_location(path0, file$7, 69, 265, 4088);
    			attr_dev(path1, "d", "M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0");
    			add_location(path1, file$7, 69, 351, 4174);
    			attr_dev(path2, "d", "M14 4l0 4l-6 0l0 -4");
    			add_location(path2, file$7, 69, 409, 4232);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "width", "23");
    			attr_dev(svg_1, "height", "23");
    			attr_dev(svg_1, "viewBox", "0 0 24 24");
    			attr_dev(svg_1, "fill", "none");
    			attr_dev(svg_1, "stroke", "white");
    			attr_dev(svg_1, "stroke-width", "2");
    			attr_dev(svg_1, "stroke-linecap", "round");
    			attr_dev(svg_1, "stroke-linejoin", "round");
    			attr_dev(svg_1, "class", "tabler-icon tabler-icon-device-floppy svelte-r7fnpc");
    			attr_dev(svg_1, "aria-hidden", "true");
    			attr_dev(svg_1, "focusable", "false");
    			add_location(svg_1, file$7, 69, 8, 3831);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path0);
    			append_dev(svg_1, path1);
    			append_dev(svg_1, path2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_26$1.name,
    		type: "if",
    		source: "(69:4) {#if name===\\\"save\\\"}",
    		ctx
    	});

    	return block;
    }

    // (72:4) {#if name==="Gyre" || name==="GyreLeftMenu"}
    function create_if_block_25$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAMAAACKeiw+AAAC/VBMVEUAAAAfQ1FJNEQ4TVEfPFcsd5MgSGEeSlpzf5c+sMgXia8XT20vgpcmOFEdNU0YYoWjQ2pMT2oganJeLUxZN0BOSlAck/h1hqck5PZQXn0bLEQotdcUGy1H+/8UfKhAgd3qiLc81ugvyN4jd8rpWosnM01EoLFJwc3WcaNYX2Imt8h6e4ZDere3vc2ssb8fgp6ZHVhuc4Ali6JRdp2oWECJkJkJRmtCSVAoQFl4e38mdn1lZ2IkPlqkVP8Hkv8GBRAAh/88YWoNDx1K/v87+f8Bxf8Jff/hkPoNR+//c5MsUFofNkcTGCgBAAVn//9X//8x/P8b7v9a3/8azv8Dp//TgP+aTP+5Rf+wQP8Nzv4f2v2/aP3kmPw74vvJefs12vm42fkBbu7yjOiutdYFQ9Ton9MCM87sWMvuaMrjbsYCJLNUMpEKG3/7V3AfQG8tUWx0AGUnS2M0RlUnQVRvAFMnNFAcLEj/nj4WKDoTHDgWIjUUISz+ww17//828P8z7P8M5//Q5v9q3P/11P8AvP8Asf/lov//nf9Amv//bP+6Tv//Rv+iRf8NVv5H6v1Yz/3SiP2I4fxmtfzYt/vqyvgam/cAgveedve4YPaR0vVp0PRZxPRBxfKySvGhzPBAr/D/c+wHuOsDU+rklOnXaunKWenCheTRRuOTn+I8iOCUzd3lUdz/lNv/ttractq1qNkZltcBZdQXhNI/udGMxtBpqs/Ses3uhMcCYMf/4sLLY8EkYsEGPb0Se7plSbjmVbe2c7bilrUfi7P1abD/S6/rSq1tXKwoQ6z1sKSdTKT0s6Fvf6BLdZ7WZ55pZ54uhJsGHpf4UpXaopMsgpLLAJL6Y4+iAI7jRYvkAInFJoc0eob8aIMcOYJ4IoJDVoD0wX9WJH4RLHjzPnfJPnToXXBNAHCbE2wTJ2lhjmNxoGIgOWGtI2Bhil2aEVSfJFKRC1H/tUyZAEv/g0pnd0hnAEPMnzr/tif/pyb/iSCYiBT/pADmngDSmwDFkQD/jQDNN3N7AAAAPXRSTlMAGRAKk3w3Kdq/lZWNe3FnX0hDQxsV/f36+vr29vLt5+Hg2dHPy8nEw72pmpiTjIyKfXhycW1jYFpXNSQd0lS2vQAAAchJREFUKM9ioCIwUuPRssIpq+8X2yChxIhLmtMvKpCVgRm7JBu7uvOsJjYcWhmNeThdZjazYpcVZdSRXzk/PqFRiIEJizQ/l3JH/6TpSxcsE8Qiyy69d45LQG1C0uL2tSboksyMQnKbXaLmnbz7IPvY+p0qAujmcx9ydk1+9uXtu/clT/dN6dRA851ZrGvQ2Y+5Vz1vP3ldkj25W0EU1WX1rROvP8qY656U4fm44Fzb6jXCyNKsda5bcveHARY9Ic52iefNglVBmSJIsiJbgyNf/lhuG5N6IsZ23cVrB5xXCCBkrbXPTA28/CvdNvRgzalQ28NXdvnPNkC43pSjaLedw89v4bbul1LdbTNvbOuLR7Jb93Rpfprdxj8fwnui42aEHT2SvFAWyWo98cqiOx52O/7WbO+KiEj/dH9DgCKStCVHWZVjjodd4uff38vL/33dFOnPhRyohvecioHybg6Jt968OD+tJVgMJc0wSVbaezk+z+p1c3CwCwlxW4SWKsxLnXyLHfMfXshKS0nZcxwjUnkr7H2rC728CvPyXnlrYsa4RZmPva9Thbd3tY8qtuTExCJV5WRv7yPDiyM1svOxcLPw2RCfbQBuO530bO8cGwAAAABJRU5ErkJggg==")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$7, 73, 8, 4401);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_25$1.name,
    		type: "if",
    		source: "(72:4) {#if name===\\\"Gyre\\\" || name===\\\"GyreLeftMenu\\\"}",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#if name==="list"}
    function create_if_block_24$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m1 9.6262715h12v2.6837195h-12zm0-3.909844h12v2.68288h-12zm0-4.026418h12v2.684558h-12z");
    			add_location(path, file$7, 76, 93, 6386);
    			attr_dev(svg_1, "viewBox", "0 0 14 14");
    			attr_dev(svg_1, "width", "15");
    			attr_dev(svg_1, "height", "15");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 76, 8, 6301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_24$1.name,
    		type: "if",
    		source: "(76:4) {#if name===\\\"list\\\"}",
    		ctx
    	});

    	return block;
    }

    // (79:4) {#if name==="properties"}
    function create_if_block_23$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m3.6580703 10.816142q0-.189779-.1388283-.328607-.1388283-.138828-.328607-.138828-.1897788 0-.3286071.138828-.1388283.138828-.1388283.328607 0 .189779.1388283.328607.1388283.138828.3286071.138828.1897787 0 .328607-.138828.1388283-.138828.1388283-.328607zm4.7038018-3.0673106-4.980991 4.9809906q-.2701776.270178-.657214.270178-.3795575 0-.6646931-.270178l-.7740729-.788563q-.2776566-.262699-.2776566-.657214 0-.387037.2776566-.664693l4.9739794-4.9739796q.2846681.7156435.8362418 1.2672172.5515737.5515737 1.2672172.8362418zm4.6304139-3.177158q0 .2846681-.167808.7740729-.343099.9788096-1.20131 1.5883453-.858211.6095357-1.8879709.6100031-1.3513555 0-2.3114677-.9605796-.9601122-.9605796-.9605796-2.3114677-.0004675-1.3508882.9605796-2.3114678.961047-.9605796 2.3114677-.9605796.4234959 0 .8871919.1205983.463696.1205983.785292.3398255.116859.080399.116859.2047367 0 .1243378-.116859.2047367l-2.1399192 1.2344967v1.6360237l1.4097852.7815519q.03646-.021969.576814-.354316.540356-.3323466.989562-.5917732.449204-.2594266.515114-.2594266.109379 0 .171548.07292.06217.07292.06217.1827673z");
    			add_location(path, file$7, 79, 91, 6624);
    			attr_dev(svg_1, "viewBox", "0 0 14 14");
    			attr_dev(svg_1, "width", "20");
    			attr_dev(svg_1, "height", "20");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 79, 8, 6541);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_23$1.name,
    		type: "if",
    		source: "(79:4) {#if name===\\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (82:4) {#if name==="editForm"}
    function create_if_block_22$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m 1.1997995,12.993916 c -0.079034,-0.023 -0.164071,-0.1093 -0.1879813,-0.1914 -0.012005,-0.042 -0.013006,-0.6895 -0.011005,-5.8210003 l 0,-5.774 0.02201,-0.045 c 0.028012,-0.057 0.083036,-0.1117 0.1401606,-0.1401 l 0.045019,-0.022 5.7922041,0 5.7923041,0 0.05102,0.025 c 0.05602,0.027 0.103645,0.075 0.135459,0.1345 l 0.02101,0.039 0,5.7832 c 0,5.3765003 0,5.7866003 -0.01301,5.8311003 -0.01901,0.06 -0.07903,0.1291 -0.141761,0.1621 l -0.04602,0.024 -5.7877023,0 c -3.4562942,9e-4 -5.799207,0 -5.8160143,-0.01 z m 11.2366575,-5.9919003 0,-5.4342 -5.4319481,0 -5.4318482,0 0,5.4229 c 0,2.9826 -4.002e-4,5.4280003 0,5.4342003 0,0.01 1.0990751,0.011 5.4365502,0.011 l 5.4321481,0 0,-5.4342003 z m -6.8619663,3.7181003 0,-0.8603003 0.8557699,0 0.85577,0 0,0.8603003 0,0.8603 -0.85577,0 -0.8557699,0 0,-0.8603 z m 1.1439945,0 0,-0.2838 -0.2882246,0 -0.2883246,0 0,0.2838 0,0.2837 0.2883246,0 0.2882246,0 0,-0.2837 z m 1.1440947,0 0,-0.2838 1.7160418,0 1.7160413,0 0,0.2838 0,0.2837 -1.7160413,0 -1.7160418,0 0,-0.2837 z m -2.2880892,-3.1483003 0,-1.1441 2.8600364,0 2.8601359,0 0,1.1441 0,1.1439 -2.8601359,0 -2.8600364,0 0,-1.1439 z m 5.1436233,0 0,-0.5721 -2.2880888,0 -2.2880892,0 0,0.5661 c 0,0.3113 0,0.5687 0.010004,0.572 0,0 1.0329466,0.01 2.2880892,0.01 l 2.2820868,0 0,-0.572 z m -7.9992578,0 0,-0.2884 1.1395927,0 1.1394925,0 0,0.2884 0,0.2882 -1.1394925,0 -1.1395927,0 0,-0.2882 z m 2.8556345,-3.4321 0,-1.1441 2.8600364,0 2.8601359,0 0,1.1441 0,1.144 -2.8601359,0 -2.8600364,0 0,-1.144 z m 5.1436233,0 0,-0.5721 -2.2880888,0 -2.2880892,0 0,0.5661 c 0,0.3112 0,0.5686 0.010004,0.5719 0,0 1.0329466,0.01 2.2880892,0.01 l 2.2820868,0 0,-0.5719 z m -7.9992578,0 0,-0.2839 1.1395927,0 1.1394925,0 0,0.2839 0,0.2837 -1.1394925,0 -1.1395927,0 0,-0.2837 z");
    			add_location(path, file$7, 82, 111, 7876);
    			attr_dev(svg_1, "width", "20");
    			attr_dev(svg_1, "height", "20");
    			attr_dev(svg_1, "aria-hidden", "true");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "viewBox", "0 0 14 14");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 82, 8, 7773);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_22$1.name,
    		type: "if",
    		source: "(82:4) {#if name===\\\"editForm\\\"}",
    		ctx
    	});

    	return block;
    }

    // (85:4) {#if name==="editRules"}
    function create_if_block_21$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m6.6 6.996925q0-.6625-.46875-1.13125-.46875-.46875-1.13125-.46875-.6625 0-1.13125.46875-.46875.46875-.46875 1.13125 0 .6625.46875 1.13125.46875.46875 1.13125.46875.6625 0 1.13125-.46875.46875-.46875.46875-1.13125zm4.8 3.2q0-.325-.2375-.5625-.2375-.2375-.5625-.2375-.325 0-.5625.2375-.2375.2375-.2375.5625 0 .33125.23438.56562.23437.23438.56562.23438.33125 0 .56562-.23438.23438-.23437.23438-.56562zm0-6.4q0-.325-.2375-.5625-.2375-.2375-.5625-.2375-.325 0-.5625.2375-.2375.2375-.2375.5625 0 .33125.23438.56563.23437.23437.56562.23437.33125 0 .56562-.23437.23438-.23438.23438-.56563zm-2.4 2.63125v1.15625q0 .0625-.0438.12188-.0438.0594-.1.0656l-.96875.15q-.0688.21875-.2.475.2125.3.5625.71875.0438.0625.0438.125 0 .075-.0438.11875-.14375.1875-.51563.55937-.37187.37188-.49062.37188-.0688 0-.13125-.0438l-.71875-.5625q-.23125.11875-.48125.19375-.0687.675-.14375.96875-.0438.15-.1875.15h-1.1625q-.0688 0-.125-.0469-.0563-.0469-.0625-.10938l-.14375-.95625q-.2125-.0625-.46875-.19375l-.7375.55625q-.0437.0438-.125.0438-.0687 0-.13125-.05-.9-.83125-.9-1 0-.0563.04375-.11875.0625-.0875.25625-.33125.19375-.24375.29375-.38125-.14375-.275-.21875-.5125l-.95-.15q-.0625-.006-.10625-.0594-.0437-.05305-.0437-.1218v-1.15625q0-.0625.04375-.12188.04375-.0594.1-.0656l.96875-.15q.0688-.21875.2-.475-.2125-.3-.5625-.71875-.04375-.0688-.04375-.125 0-.075.04375-.125.1375-.1875.5125-.55625.375-.36875.49375-.36875.0688 0 .13125.0437l.71875.5625q.2125-.1125.48125-.2.0687-.675.14375-.9625.0438-.15.1875-.15h1.1625q.0688 0 .125.0469.0563.0469.0625.10937l.14375.95625q.2125.0625.46875.19375l.7375-.55625q.05-.0437.125-.0437.0687 0 .13125.05.9.83125.9 1 0 .0562-.0438.11875-.075.1-.2625.3375-.1875.2375-.28125.375.14375.3.2125.5125l.95.14375q.0625.0125.10625.0656.0438.0531.0438.12187zm4 3.33125v.875q0 .1-.93125.19375-.075.16875-.1875.325.31875.70625.31875.8625 0 .025-.025.0437-.7625.44375-.775.44375-.05 0-.2875-.29375-.2375-.29375-.325-.425-.125.0125-.1875.0125-.0625 0-.1875-.0125-.0875.13125-.325.425-.2375.29375-.2875.29375-.0125 0-.775-.44375-.025-.0187-.025-.0437 0-.15625.31875-.8625-.1125-.15625-.1875-.325-.93125-.0937-.93125-.19375v-.875q0-.1.93125-.19375.0813-.18125.1875-.325-.31875-.70625-.31875-.8625 0-.025.025-.0438.025-.0125.21875-.125.19375-.1125.36875-.2125.175-.1.1875-.1.05 0 .2875.29063.2375.29062.325.42187.125-.0125.1875-.0125.0625 0 .1875.0125.31875-.44375.575-.7l.0375-.0125q.025 0 .775.4375.025.0188.025.0438 0 .15625-.31875.8625.10625.14375.1875.325.93125.0937.93125.19375zm0-6.4v.875q0 .1-.93125.19375-.075.16875-.1875.325.31875.70625.31875.8625 0 .025-.025.0438-.7625.44375-.775.44375-.05 0-.2875-.29375-.2375-.29375-.325-.425-.125.0125-.1875.0125-.0625 0-.1875-.0125-.0875.13125-.325.425-.2375.29375-.2875.29375-.0125 0-.775-.44375-.025-.0188-.025-.0438 0-.15625.31875-.8625-.1125-.15625-.1875-.325-.93125-.0937-.93125-.19375v-.875q0-.1.93125-.19375.0813-.18125.1875-.325-.31875-.70625-.31875-.8625 0-.025.025-.0438.025-.0125.21875-.125.19375-.1125.36875-.2125.175-.1.1875-.1.05 0 .2875.29062.2375.29063.325.42188.125-.0125.1875-.0125.0625 0 .1875.0125.31875-.44375.575-.7l.0375-.0125q.025 0 .775.4375.025.0188.025.0438 0 .15625-.31875.8625.10625.14375.1875.325.93125.0937.93125.19375z");
    			add_location(path, file$7, 85, 92, 9787);
    			attr_dev(svg_1, "viewBox", "0 0 14 14");
    			attr_dev(svg_1, "width", "20");
    			attr_dev(svg_1, "height", "20");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 85, 8, 9703);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21$1.name,
    		type: "if",
    		source: "(85:4) {#if name===\\\"editRules\\\"}",
    		ctx
    	});

    	return block;
    }

    // (88:4) {#if name==="close"}
    function create_if_block_20$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m12 10.047142q0 .3367-.235692.572383l-1.144783 1.144783q-.235683.235692-.572383.235692-.3367003 0-.572392-.235692l-2.47475-2.47475-2.47475 2.47475q-.2356917.235692-.5723917.235692-.3367 0-.5723833-.235692l-1.1447833-1.144783q-.2356917-.235683-.2356917-.572383 0-.3367.2356917-.572392l2.47475-2.47475-2.47475-2.47475q-.2356917-.2356917-.2356917-.5723917 0-.3367.2356917-.5723833l1.1447833-1.1447833q.2356833-.2356917.5723833-.2356917.3367 0 .5723917.2356917l2.47475 2.47475 2.47475-2.47475q.2356917-.2356917.572392-.2356917.3367 0 .572383.2356917l1.144783 1.1447833q.235692.2356833.235692.5723833 0 .3367-.235692.5723917l-2.4747497 2.47475 2.4747497 2.47475q.235692.235692.235692.572392z");
    			add_location(path, file$7, 88, 91, 13135);
    			attr_dev(svg_1, "viewBox", "0 0 14 14");
    			attr_dev(svg_1, "width", "15");
    			attr_dev(svg_1, "height", "15");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 88, 8, 13052);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_20$1.name,
    		type: "if",
    		source: "(88:4) {#if name===\\\"close\\\"}",
    		ctx
    	});

    	return block;
    }

    // (91:4) {#if name==="delete"}
    function create_if_block_19$1(ctx) {
    	let svg_1;
    	let g0;
    	let g1;
    	let g2;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g2 = svg_element("g");
    			path = svg_element("path");
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$7, 91, 124, 14003);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$7, 91, 171, 14050);
    			attr_dev(path, "d", "M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6");
    			attr_dev(path, "stroke", "#ffffffff");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$7, 91, 281, 14160);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$7, 91, 252, 14131);
    			attr_dev(svg_1, "width", "24px");
    			attr_dev(svg_1, "height", "24px");
    			attr_dev(svg_1, "viewBox", "0 0 24 24");
    			attr_dev(svg_1, "fill", "none");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "stroke", "#ffffff");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 91, 8, 13887);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, g0);
    			append_dev(svg_1, g1);
    			append_dev(svg_1, g2);
    			append_dev(g2, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_19$1.name,
    		type: "if",
    		source: "(91:4) {#if name===\\\"delete\\\"}",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#if name==="errorlogs"}
    function create_if_block_18$1(ctx) {
    	let svg_1;
    	let g0;
    	let g1;
    	let g3;
    	let g2;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g3 = svg_element("g");
    			g2 = svg_element("g");
    			path = svg_element("path");
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$7, 94, 107, 14957);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$7, 94, 154, 15004);
    			attr_dev(path, "id", "Vector");
    			attr_dev(path, "d", "M12 6V14M12.0498 18V18.1L11.9502 18.1002V18H12.0498Z");
    			attr_dev(path, "stroke", "#ffffff");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$7, 94, 291, 15141);
    			attr_dev(g2, "id", "Warning / Warning");
    			add_location(g2, file$7, 94, 264, 15114);
    			attr_dev(g3, "id", "SVGRepo_iconCarrier");
    			add_location(g3, file$7, 94, 235, 15085);
    			attr_dev(svg_1, "width", "24px");
    			attr_dev(svg_1, "height", "24px");
    			attr_dev(svg_1, "viewBox", "0 0 24 24");
    			attr_dev(svg_1, "fill", "none");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 94, 8, 14858);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, g0);
    			append_dev(svg_1, g1);
    			append_dev(svg_1, g3);
    			append_dev(g3, g2);
    			append_dev(g2, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18$1.name,
    		type: "if",
    		source: "(94:4) {#if name===\\\"errorlogs\\\"}",
    		ctx
    	});

    	return block;
    }

    // (98:4) {#if name==="arrowRight"}
    function create_if_block_17$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m8.578947 3.30551v2.431332h-7.578947v2.526316h7.578947v2.431332l4.421053-3.69449z");
    			add_location(path, file$7, 98, 92, 15458);
    			attr_dev(svg_1, "viewBox", "0 0 14 14");
    			attr_dev(svg_1, "width", "20");
    			attr_dev(svg_1, "height", "20");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 98, 8, 15374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17$1.name,
    		type: "if",
    		source: "(98:4) {#if name===\\\"arrowRight\\\"}",
    		ctx
    	});

    	return block;
    }

    // (101:4) {#if name==="removeFromList"}
    function create_if_block_16$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m5.4999377 5.7501979v4.5001871q0 .109505-.070503.179508-.070503.07-.1795074.0705h-.5000209q-.1095045 0-.1795075-.0705-.070003-.0705-.070503-.179508v-4.5001871q0-.1095045.070503-.1795075.070503-.070003.1795075-.070503h.5000209q.1095045 0 .1795074.070503.070003.070503.070503.1795075zm2.0000833 0v4.5001871q0 .109505-.070503.179508-.070503.07-.1795075.0705h-.5000207q-.1095046 0-.1795075-.0705-.070003-.0705-.070503-.179508v-4.5001871q0-.1095045.070503-.1795075.070503-.070003.1795075-.070503h.5000208q.1095046 0 .1795075.070503.070003.070503.070503.1795075zm2.0000833 0v4.5001871q0 .109505-.070503.179508-.070503.07-.1795075.0705h-.5000207q-.1095046 0-.1795075-.0705-.070003-.0705-.070503-.179508v-4.5001871q0-.1095045.070503-.1795075.070503-.070003.1795075-.070503h.5000209q.1095046 0 .1795075.070503.070003.070503.070503.1795075zm1.0000417 5.6567361v-7.406309h-7.0002917v7.406309q0 .172007.054502.316513.054502.144506.1135047.211009.059003.0665.082004.0665h6.500271q.0235 0 .082-.0665.0585-.0665.113504-.211009.055-.144506.0545-.316513zm-5.2502187-8.4068507h3.5001458l-.3750156-.914038q-.0545023-.070503-.1330056-.0860036h-2.4766032q-.078003.015501-.1330055.086004zm7.2503017.2500105v.5000208q0 .1095046-.0705.1795075-.0705.070003-.179507.070503h-.750031v7.4063089q0 .648527-.367016 1.121046-.367018.47252-.883039.47252h-6.5002712q-.5155215 0-.8830368-.457019-.3675154-.457019-.3670153-1.105546v-7.43781h-.7500313q-.1095046 0-.1795075-.070503-.0700029-.0705029-.0705029-.1795074v-.5000209q0-.1095045.070503-.1795074.070503-.070003.1795075-.070503h2.4141005l.5470228-1.3045543q.1170049-.2890121.4220176-.4920205.3050127-.2030085.6170257-.2030085h2.5001042q.312513 0 .6170257.2030085.3045127.2030084.4220176.4920205l.5470227 1.3045543h2.4141007q.109504 0 .179507.070503.07.070503.0705.1795074z");
    			add_location(path, file$7, 101, 109, 15714);
    			attr_dev(svg_1, "viewBox", "0 0 14 14");
    			attr_dev(svg_1, "width", "15");
    			attr_dev(svg_1, "height", "15");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			set_style(svg_1, "fill", "red");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 101, 8, 15613);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16$1.name,
    		type: "if",
    		source: "(101:4) {#if name===\\\"removeFromList\\\"}",
    		ctx
    	});

    	return block;
    }

    // (104:4) {#if name==="comboList"}
    function create_if_block_15$1(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m1 2.8h12v1.2h-12zm0 2.4h12v1.2h-12zm0 2.4h12v1.2h-12zm0 2.4h12v1.2h-12z");
    			add_location(path, file$7, 104, 92, 17663);
    			attr_dev(svg_1, "viewBox", "0 0 14 14");
    			attr_dev(svg_1, "width", "20");
    			attr_dev(svg_1, "height", "20");
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 104, 8, 17579);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15$1.name,
    		type: "if",
    		source: "(104:4) {#if name===\\\"comboList\\\"}",
    		ctx
    	});

    	return block;
    }

    // (107:4) {#if name==="form_text"}
    function create_if_block_14$2(ctx) {
    	let svg_1;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path0, "d", "M10 5h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v1h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4v1zM6 5V4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4z");
    			add_location(path0, file$7, 108, 8, 17893);
    			attr_dev(path1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path1, "fill-rule", "evenodd");
    			attr_dev(path1, "d", "M8 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13A.5.5 0 0 1 8 1z");
    			add_location(path1, file$7, 109, 8, 18114);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 107, 4, 17800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path0);
    			append_dev(svg_1, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14$2.name,
    		type: "if",
    		source: "(107:4) {#if name===\\\"form_text\\\"}",
    		ctx
    	});

    	return block;
    }

    // (114:4) {#if name==="form_text_output"}
    function create_if_block_13$2(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479z");
    			add_location(path, file$7, 115, 8, 18406);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 114, 4, 18315);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13$2.name,
    		type: "if",
    		source: "(114:4) {#if name===\\\"form_text_output\\\"}",
    		ctx
    	});

    	return block;
    }

    // (120:4) {#if name==="form_textarea"}
    function create_if_block_12$2(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path, "d", "M0 4.5A2.5 2.5 0 0 1 2.5 2h11A2.5 2.5 0 0 1 16 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 11.5v-7zM2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-11zm10.854 4.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708l3-3a.5.5 0 0 1 .708 0zm0 2.5a.5.5 0 0 1 0 .708l-.5.5a.5.5 0 0 1-.708-.708l.5-.5a.5.5 0 0 1 .708 0z");
    			add_location(path, file$7, 120, 92, 18778);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 120, 8, 18694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$2.name,
    		type: "if",
    		source: "(120:4) {#if name===\\\"form_textarea\\\"}",
    		ctx
    	});

    	return block;
    }

    // (123:4) {#if name==="form_checkbox"}
    function create_if_block_11$2(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8");
    			add_location(path, file$7, 123, 88, 19334);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 123, 8, 19254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$2.name,
    		type: "if",
    		source: "(123:4) {#if name===\\\"form_checkbox\\\"}",
    		ctx
    	});

    	return block;
    }

    // (126:4) {#if name==="form_dropdown"}
    function create_if_block_10$2(ctx) {
    	let svg_1;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path0, "d", "M0 1.5A1.5 1.5 0 0 1 1.5 0h8A1.5 1.5 0 0 1 11 1.5v2A1.5 1.5 0 0 1 9.5 5h-8A1.5 1.5 0 0 1 0 3.5v-2zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-8z");
    			add_location(path0, file$7, 127, 8, 19570);
    			attr_dev(path1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path1, "d", "m7.823 2.823-.396-.396A.25.25 0 0 1 7.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2H1zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z");
    			add_location(path1, file$7, 128, 8, 19814);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 126, 4, 19476);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path0);
    			append_dev(svg_1, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$2.name,
    		type: "if",
    		source: "(126:4) {#if name===\\\"form_dropdown\\\"}",
    		ctx
    	});

    	return block;
    }

    // (132:4) {#if name==="form_slider"}
    function create_if_block_9$2(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z");
    			add_location(path, file$7, 132, 95, 20404);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 132, 8, 20317);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$2.name,
    		type: "if",
    		source: "(132:4) {#if name===\\\"form_slider\\\"}",
    		ctx
    	});

    	return block;
    }

    // (135:4) {#if name==="form_layers"}
    function create_if_block_8$2(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0zM8 9.433 1.562 6 8 2.567 14.438 6z");
    			add_location(path, file$7, 135, 88, 20905);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 135, 8, 20825);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(135:4) {#if name===\\\"form_layers\\\"}",
    		ctx
    	});

    	return block;
    }

    // (138:4) {#if name==="form_layers2"}
    function create_if_block_7$2(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882zM8 9.433 1.562 6 8 2.567 14.438 6z");
    			add_location(path, file$7, 138, 89, 21365);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 138, 8, 21284);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(138:4) {#if name===\\\"form_layers2\\\"}",
    		ctx
    	});

    	return block;
    }

    // (141:4) {#if name==="form_preview"}
    function create_if_block_6$2(ctx) {
    	let svg_1;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018");
    			add_location(path0, file$7, 142, 8, 21742);
    			attr_dev(path1, "d", "M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11");
    			add_location(path1, file$7, 143, 8, 21837);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 141, 4, 21651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path0);
    			append_dev(svg_1, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(141:4) {#if name===\\\"form_preview\\\"}",
    		ctx
    	});

    	return block;
    }

    // (147:4) {#if name==="form_layers3"}
    function create_if_block_5$2(ctx) {
    	let svg_1;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M7.765 1.559a.5.5 0 0 1 .47 0l7.5 4a.5.5 0 0 1 0 .882l-7.5 4a.5.5 0 0 1-.47 0l-7.5-4a.5.5 0 0 1 0-.882z");
    			add_location(path0, file$7, 148, 8, 22191);
    			attr_dev(path1, "d", "m2.125 8.567-1.86.992a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882l-1.86-.992-5.17 2.756a1.5 1.5 0 0 1-1.41 0z");
    			add_location(path1, file$7, 149, 8, 22316);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 147, 4, 22099);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path0);
    			append_dev(svg_1, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(147:4) {#if name===\\\"form_layers3\\\"}",
    		ctx
    	});

    	return block;
    }

    // (153:6) {#if name=="form_advanced"}
    function create_if_block_4$3(ctx) {
    	let svg_1;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0");
    			add_location(path0, file$7, 154, 8, 22623);
    			attr_dev(path1, "d", "M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z");
    			add_location(path1, file$7, 155, 8, 22765);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 153, 6, 22531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path0);
    			append_dev(svg_1, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(153:6) {#if name==\\\"form_advanced\\\"}",
    		ctx
    	});

    	return block;
    }

    // (159:6) {#if name=="form_colorpicker"}
    function create_if_block_3$3(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708zM2 12.707l7-7L10.293 7l-7 7H2z");
    			add_location(path, file$7, 160, 12, 24174);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 159, 8, 24080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(159:6) {#if name==\\\"form_colorpicker\\\"}",
    		ctx
    	});

    	return block;
    }

    // (164:7) {#if name=="form_magnifier"}
    function create_if_block_2$5(ctx) {
    	let svg_1;
    	let path;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0");
    			add_location(path, file$7, 165, 8, 24662);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "fill", "currentColor");
    			attr_dev(svg_1, "viewBox", "0 0 16 16");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 164, 7, 24572);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(164:7) {#if name==\\\"form_magnifier\\\"}",
    		ctx
    	});

    	return block;
    }

    // (170:4) {#if name=="deactivated"}
    function create_if_block_1$5(ctx) {
    	let svg_1;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M8 8L40 40");
    			attr_dev(path0, "stroke", "#ffffff");
    			attr_dev(path0, "stroke-width", "4");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			add_location(path0, file$7, 170, 103, 25008);
    			attr_dev(path1, "d", "M8 40L40 8");
    			attr_dev(path1, "stroke", "#ffffff");
    			attr_dev(path1, "stroke-width", "4");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			add_location(path1, file$7, 170, 206, 25111);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "width", "16");
    			attr_dev(svg_1, "height", "16");
    			attr_dev(svg_1, "viewBox", "0 0 48 48");
    			attr_dev(svg_1, "fill", "none");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 170, 8, 24913);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path0);
    			append_dev(svg_1, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(170:4) {#if name==\\\"deactivated\\\"}",
    		ctx
    	});

    	return block;
    }

    // (174:4) {#if name=="activateback"}
    function create_if_block$7(ctx) {
    	let svg_1;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10 33C10 25.7011 14.103 19.4168 20 16.5919C22.1347 15.5693 24.5046 15 27 15C36.3888 15 44 23.0589 44 33");
    			attr_dev(path0, "stroke", "#ffffff");
    			attr_dev(path0, "stroke-width", "4");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			add_location(path0, file$7, 174, 103, 25370);
    			attr_dev(path1, "d", "M18 28L10 33L4 25");
    			attr_dev(path1, "stroke", "#ffffff");
    			attr_dev(path1, "stroke-width", "4");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			add_location(path1, file$7, 174, 300, 25567);
    			attr_dev(svg_1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg_1, "width", "16");
    			attr_dev(svg_1, "height", "16");
    			attr_dev(svg_1, "viewBox", "0 0 48 48");
    			attr_dev(svg_1, "fill", "none");
    			attr_dev(svg_1, "class", "svelte-r7fnpc");
    			add_location(svg_1, file$7, 174, 8, 25275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);
    			append_dev(svg_1, path0);
    			append_dev(svg_1, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(174:4) {#if name==\\\"activateback\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let t22;
    	let t23;
    	let t24;
    	let t25;
    	let t26;
    	let t27;
    	let t28;
    	let t29;
    	let div_class_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*svg*/ ctx[1] && create_if_block_30$1(ctx);
    	let if_block1 = /*name*/ ctx[0] === "move" && create_if_block_29$1(ctx);
    	let if_block2 = /*name*/ ctx[0] === "down" && create_if_block_28$1(ctx);
    	let if_block3 = /*name*/ ctx[0] === "up" && create_if_block_27$1(ctx);
    	let if_block4 = /*name*/ ctx[0] === "save" && create_if_block_26$1(ctx);
    	let if_block5 = (/*name*/ ctx[0] === "Gyre" || /*name*/ ctx[0] === "GyreLeftMenu") && create_if_block_25$1(ctx);
    	let if_block6 = /*name*/ ctx[0] === "list" && create_if_block_24$1(ctx);
    	let if_block7 = /*name*/ ctx[0] === "properties" && create_if_block_23$1(ctx);
    	let if_block8 = /*name*/ ctx[0] === "editForm" && create_if_block_22$1(ctx);
    	let if_block9 = /*name*/ ctx[0] === "editRules" && create_if_block_21$1(ctx);
    	let if_block10 = /*name*/ ctx[0] === "close" && create_if_block_20$1(ctx);
    	let if_block11 = /*name*/ ctx[0] === "delete" && create_if_block_19$1(ctx);
    	let if_block12 = /*name*/ ctx[0] === "errorlogs" && create_if_block_18$1(ctx);
    	let if_block13 = /*name*/ ctx[0] === "arrowRight" && create_if_block_17$1(ctx);
    	let if_block14 = /*name*/ ctx[0] === "removeFromList" && create_if_block_16$1(ctx);
    	let if_block15 = /*name*/ ctx[0] === "comboList" && create_if_block_15$1(ctx);
    	let if_block16 = /*name*/ ctx[0] === "form_text" && create_if_block_14$2(ctx);
    	let if_block17 = /*name*/ ctx[0] === "form_text_output" && create_if_block_13$2(ctx);
    	let if_block18 = /*name*/ ctx[0] === "form_textarea" && create_if_block_12$2(ctx);
    	let if_block19 = /*name*/ ctx[0] === "form_checkbox" && create_if_block_11$2(ctx);
    	let if_block20 = /*name*/ ctx[0] === "form_dropdown" && create_if_block_10$2(ctx);
    	let if_block21 = /*name*/ ctx[0] === "form_slider" && create_if_block_9$2(ctx);
    	let if_block22 = /*name*/ ctx[0] === "form_layers" && create_if_block_8$2(ctx);
    	let if_block23 = /*name*/ ctx[0] === "form_layers2" && create_if_block_7$2(ctx);
    	let if_block24 = /*name*/ ctx[0] === "form_preview" && create_if_block_6$2(ctx);
    	let if_block25 = /*name*/ ctx[0] === "form_layers3" && create_if_block_5$2(ctx);
    	let if_block26 = /*name*/ ctx[0] == "form_advanced" && create_if_block_4$3(ctx);
    	let if_block27 = /*name*/ ctx[0] == "form_colorpicker" && create_if_block_3$3(ctx);
    	let if_block28 = /*name*/ ctx[0] == "form_magnifier" && create_if_block_2$5(ctx);
    	let if_block29 = /*name*/ ctx[0] == "deactivated" && create_if_block_1$5(ctx);
    	let if_block30 = /*name*/ ctx[0] == "activateback" && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			t7 = space();
    			if (if_block8) if_block8.c();
    			t8 = space();
    			if (if_block9) if_block9.c();
    			t9 = space();
    			if (if_block10) if_block10.c();
    			t10 = space();
    			if (if_block11) if_block11.c();
    			t11 = space();
    			if (if_block12) if_block12.c();
    			t12 = space();
    			if (if_block13) if_block13.c();
    			t13 = space();
    			if (if_block14) if_block14.c();
    			t14 = space();
    			if (if_block15) if_block15.c();
    			t15 = space();
    			if (if_block16) if_block16.c();
    			t16 = space();
    			if (if_block17) if_block17.c();
    			t17 = space();
    			if (if_block18) if_block18.c();
    			t18 = space();
    			if (if_block19) if_block19.c();
    			t19 = space();
    			if (if_block20) if_block20.c();
    			t20 = space();
    			if (if_block21) if_block21.c();
    			t21 = space();
    			if (if_block22) if_block22.c();
    			t22 = space();
    			if (if_block23) if_block23.c();
    			t23 = space();
    			if (if_block24) if_block24.c();
    			t24 = space();
    			if (if_block25) if_block25.c();
    			t25 = space();
    			if (if_block26) if_block26.c();
    			t26 = space();
    			if (if_block27) if_block27.c();
    			t27 = space();
    			if (if_block28) if_block28.c();
    			t28 = space();
    			if (if_block29) if_block29.c();
    			t29 = space();
    			if (if_block30) if_block30.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*className*/ ctx[2]) + " svelte-r7fnpc"));
    			add_location(div, file$7, 48, 0, 2232);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t3);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t4);
    			if (if_block5) if_block5.m(div, null);
    			append_dev(div, t5);
    			if (if_block6) if_block6.m(div, null);
    			append_dev(div, t6);
    			if (if_block7) if_block7.m(div, null);
    			append_dev(div, t7);
    			if (if_block8) if_block8.m(div, null);
    			append_dev(div, t8);
    			if (if_block9) if_block9.m(div, null);
    			append_dev(div, t9);
    			if (if_block10) if_block10.m(div, null);
    			append_dev(div, t10);
    			if (if_block11) if_block11.m(div, null);
    			append_dev(div, t11);
    			if (if_block12) if_block12.m(div, null);
    			append_dev(div, t12);
    			if (if_block13) if_block13.m(div, null);
    			append_dev(div, t13);
    			if (if_block14) if_block14.m(div, null);
    			append_dev(div, t14);
    			if (if_block15) if_block15.m(div, null);
    			append_dev(div, t15);
    			if (if_block16) if_block16.m(div, null);
    			append_dev(div, t16);
    			if (if_block17) if_block17.m(div, null);
    			append_dev(div, t17);
    			if (if_block18) if_block18.m(div, null);
    			append_dev(div, t18);
    			if (if_block19) if_block19.m(div, null);
    			append_dev(div, t19);
    			if (if_block20) if_block20.m(div, null);
    			append_dev(div, t20);
    			if (if_block21) if_block21.m(div, null);
    			append_dev(div, t21);
    			if (if_block22) if_block22.m(div, null);
    			append_dev(div, t22);
    			if (if_block23) if_block23.m(div, null);
    			append_dev(div, t23);
    			if (if_block24) if_block24.m(div, null);
    			append_dev(div, t24);
    			if (if_block25) if_block25.m(div, null);
    			append_dev(div, t25);
    			if (if_block26) if_block26.m(div, null);
    			append_dev(div, t26);
    			if (if_block27) if_block27.m(div, null);
    			append_dev(div, t27);
    			if (if_block28) if_block28.m(div, null);
    			append_dev(div, t28);
    			if (if_block29) if_block29.m(div, null);
    			append_dev(div, t29);
    			if (if_block30) if_block30.m(div, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousedown", /*mousedown_handler*/ ctx[6], false, false, false, false),
    					listen_dev(div, "click", /*click_handler*/ ctx[7], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*svg*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_30$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*name*/ ctx[0] === "move") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_29$1(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*name*/ ctx[0] === "down") {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_28$1(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*name*/ ctx[0] === "up") {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_27$1(ctx);
    					if_block3.c();
    					if_block3.m(div, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*name*/ ctx[0] === "save") {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_26$1(ctx);
    					if_block4.c();
    					if_block4.m(div, t4);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*name*/ ctx[0] === "Gyre" || /*name*/ ctx[0] === "GyreLeftMenu") {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_25$1(ctx);
    					if_block5.c();
    					if_block5.m(div, t5);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*name*/ ctx[0] === "list") {
    				if (if_block6) ; else {
    					if_block6 = create_if_block_24$1(ctx);
    					if_block6.c();
    					if_block6.m(div, t6);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*name*/ ctx[0] === "properties") {
    				if (if_block7) ; else {
    					if_block7 = create_if_block_23$1(ctx);
    					if_block7.c();
    					if_block7.m(div, t7);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*name*/ ctx[0] === "editForm") {
    				if (if_block8) ; else {
    					if_block8 = create_if_block_22$1(ctx);
    					if_block8.c();
    					if_block8.m(div, t8);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*name*/ ctx[0] === "editRules") {
    				if (if_block9) ; else {
    					if_block9 = create_if_block_21$1(ctx);
    					if_block9.c();
    					if_block9.m(div, t9);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*name*/ ctx[0] === "close") {
    				if (if_block10) ; else {
    					if_block10 = create_if_block_20$1(ctx);
    					if_block10.c();
    					if_block10.m(div, t10);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (/*name*/ ctx[0] === "delete") {
    				if (if_block11) ; else {
    					if_block11 = create_if_block_19$1(ctx);
    					if_block11.c();
    					if_block11.m(div, t11);
    				}
    			} else if (if_block11) {
    				if_block11.d(1);
    				if_block11 = null;
    			}

    			if (/*name*/ ctx[0] === "errorlogs") {
    				if (if_block12) ; else {
    					if_block12 = create_if_block_18$1(ctx);
    					if_block12.c();
    					if_block12.m(div, t12);
    				}
    			} else if (if_block12) {
    				if_block12.d(1);
    				if_block12 = null;
    			}

    			if (/*name*/ ctx[0] === "arrowRight") {
    				if (if_block13) ; else {
    					if_block13 = create_if_block_17$1(ctx);
    					if_block13.c();
    					if_block13.m(div, t13);
    				}
    			} else if (if_block13) {
    				if_block13.d(1);
    				if_block13 = null;
    			}

    			if (/*name*/ ctx[0] === "removeFromList") {
    				if (if_block14) ; else {
    					if_block14 = create_if_block_16$1(ctx);
    					if_block14.c();
    					if_block14.m(div, t14);
    				}
    			} else if (if_block14) {
    				if_block14.d(1);
    				if_block14 = null;
    			}

    			if (/*name*/ ctx[0] === "comboList") {
    				if (if_block15) ; else {
    					if_block15 = create_if_block_15$1(ctx);
    					if_block15.c();
    					if_block15.m(div, t15);
    				}
    			} else if (if_block15) {
    				if_block15.d(1);
    				if_block15 = null;
    			}

    			if (/*name*/ ctx[0] === "form_text") {
    				if (if_block16) ; else {
    					if_block16 = create_if_block_14$2(ctx);
    					if_block16.c();
    					if_block16.m(div, t16);
    				}
    			} else if (if_block16) {
    				if_block16.d(1);
    				if_block16 = null;
    			}

    			if (/*name*/ ctx[0] === "form_text_output") {
    				if (if_block17) ; else {
    					if_block17 = create_if_block_13$2(ctx);
    					if_block17.c();
    					if_block17.m(div, t17);
    				}
    			} else if (if_block17) {
    				if_block17.d(1);
    				if_block17 = null;
    			}

    			if (/*name*/ ctx[0] === "form_textarea") {
    				if (if_block18) ; else {
    					if_block18 = create_if_block_12$2(ctx);
    					if_block18.c();
    					if_block18.m(div, t18);
    				}
    			} else if (if_block18) {
    				if_block18.d(1);
    				if_block18 = null;
    			}

    			if (/*name*/ ctx[0] === "form_checkbox") {
    				if (if_block19) ; else {
    					if_block19 = create_if_block_11$2(ctx);
    					if_block19.c();
    					if_block19.m(div, t19);
    				}
    			} else if (if_block19) {
    				if_block19.d(1);
    				if_block19 = null;
    			}

    			if (/*name*/ ctx[0] === "form_dropdown") {
    				if (if_block20) ; else {
    					if_block20 = create_if_block_10$2(ctx);
    					if_block20.c();
    					if_block20.m(div, t20);
    				}
    			} else if (if_block20) {
    				if_block20.d(1);
    				if_block20 = null;
    			}

    			if (/*name*/ ctx[0] === "form_slider") {
    				if (if_block21) ; else {
    					if_block21 = create_if_block_9$2(ctx);
    					if_block21.c();
    					if_block21.m(div, t21);
    				}
    			} else if (if_block21) {
    				if_block21.d(1);
    				if_block21 = null;
    			}

    			if (/*name*/ ctx[0] === "form_layers") {
    				if (if_block22) ; else {
    					if_block22 = create_if_block_8$2(ctx);
    					if_block22.c();
    					if_block22.m(div, t22);
    				}
    			} else if (if_block22) {
    				if_block22.d(1);
    				if_block22 = null;
    			}

    			if (/*name*/ ctx[0] === "form_layers2") {
    				if (if_block23) ; else {
    					if_block23 = create_if_block_7$2(ctx);
    					if_block23.c();
    					if_block23.m(div, t23);
    				}
    			} else if (if_block23) {
    				if_block23.d(1);
    				if_block23 = null;
    			}

    			if (/*name*/ ctx[0] === "form_preview") {
    				if (if_block24) ; else {
    					if_block24 = create_if_block_6$2(ctx);
    					if_block24.c();
    					if_block24.m(div, t24);
    				}
    			} else if (if_block24) {
    				if_block24.d(1);
    				if_block24 = null;
    			}

    			if (/*name*/ ctx[0] === "form_layers3") {
    				if (if_block25) ; else {
    					if_block25 = create_if_block_5$2(ctx);
    					if_block25.c();
    					if_block25.m(div, t25);
    				}
    			} else if (if_block25) {
    				if_block25.d(1);
    				if_block25 = null;
    			}

    			if (/*name*/ ctx[0] == "form_advanced") {
    				if (if_block26) ; else {
    					if_block26 = create_if_block_4$3(ctx);
    					if_block26.c();
    					if_block26.m(div, t26);
    				}
    			} else if (if_block26) {
    				if_block26.d(1);
    				if_block26 = null;
    			}

    			if (/*name*/ ctx[0] == "form_colorpicker") {
    				if (if_block27) ; else {
    					if_block27 = create_if_block_3$3(ctx);
    					if_block27.c();
    					if_block27.m(div, t27);
    				}
    			} else if (if_block27) {
    				if_block27.d(1);
    				if_block27 = null;
    			}

    			if (/*name*/ ctx[0] == "form_magnifier") {
    				if (if_block28) ; else {
    					if_block28 = create_if_block_2$5(ctx);
    					if_block28.c();
    					if_block28.m(div, t28);
    				}
    			} else if (if_block28) {
    				if_block28.d(1);
    				if_block28 = null;
    			}

    			if (/*name*/ ctx[0] == "deactivated") {
    				if (if_block29) ; else {
    					if_block29 = create_if_block_1$5(ctx);
    					if_block29.c();
    					if_block29.m(div, t29);
    				}
    			} else if (if_block29) {
    				if_block29.d(1);
    				if_block29 = null;
    			}

    			if (/*name*/ ctx[0] == "activateback") {
    				if (if_block30) ; else {
    					if_block30 = create_if_block$7(ctx);
    					if_block30.c();
    					if_block30.m(div, null);
    				}
    			} else if (if_block30) {
    				if_block30.d(1);
    				if_block30 = null;
    			}

    			if (dirty & /*className*/ 4 && div_class_value !== (div_class_value = "" + (null_to_empty(/*className*/ ctx[2]) + " svelte-r7fnpc"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			if (if_block11) if_block11.d();
    			if (if_block12) if_block12.d();
    			if (if_block13) if_block13.d();
    			if (if_block14) if_block14.d();
    			if (if_block15) if_block15.d();
    			if (if_block16) if_block16.d();
    			if (if_block17) if_block17.d();
    			if (if_block18) if_block18.d();
    			if (if_block19) if_block19.d();
    			if (if_block20) if_block20.d();
    			if (if_block21) if_block21.d();
    			if (if_block22) if_block22.d();
    			if (if_block23) if_block23.d();
    			if (if_block24) if_block24.d();
    			if (if_block25) if_block25.d();
    			if (if_block26) if_block26.d();
    			if (if_block27) if_block27.d();
    			if (if_block28) if_block28.d();
    			if (if_block29) if_block29.d();
    			if (if_block30) if_block30.d();
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('Icon', slots, []);
    	let { name = "" } = $$props;
    	let { state = "" } = $$props;
    	let { deactivate = "" } = $$props;
    	let { svg = "" } = $$props;
    	let activeClass = "";
    	if (state === name && !svg) activeClass = " active";
    	if (deactivate === "deactivate") activeClass = " deactivate";
    	const dispatch = createEventDispatcher();

    	let iconsInfo = {
    		"down": { class: "default" },
    		"up": { class: "default" },
    		"close": { class: "default leftMenuIcon" },
    		"list": { class: "default leftMenuIcon" },
    		"arrowRight": { class: " arrowRight " },
    		"comboList": { class: "default leftMenuIcon2 comboList" },
    		"removeFromList": { class: "default leftMenuIcon" },
    		"properties": {
    			class: "default leftMenuIcon2 leftMenuTopMargin"
    		},
    		"editForm": {
    			class: "default leftMenuIcon2 leftMenuTopMargin"
    		},
    		"editRules": {
    			class: "default leftMenuIcon2 leftMenuTopMargin"
    		},
    		"errorlogs": {
    			class: "default leftMenuIcon2 leftMenuTopMargin"
    		},
    		"GyreLeftMenu": {
    			class: "default leftMenuIcon3 leftMenuTopMargin"
    		},
    		"form_text": { class: "default deactivate" },
    		"form_textarea": { class: "default deactivate" },
    		"form_checkbox": { class: "default deactivate" },
    		"form_dropdown": { class: "default deactivate" },
    		"form_slider": { class: "default deactivate" },
    		"form_layers": { class: "default deactivate" },
    		"form_layers2": { class: "default deactivate" },
    		"form_layers3": { class: "default deactivate" },
    		"form_preview": { class: "default deactivate" },
    		"form_advanced": { class: "default deactivate" },
    		"form_colorpicker": { class: "default deactivate" },
    		"form_magnifier": { class: "default deactivate" },
    		"form_text_output": { class: "default deactivate" }
    	};

    	let info;
    	if (svg) info = { class: "default deactivate" }; else info = iconsInfo[name];
    	let className = "outer";
    	if (info) className = info.class;
    	className += activeClass;
    	const writable_props = ['name', 'state', 'deactivate', 'svg'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = e => {
    		dispatch("mousedown", e);
    	};

    	const click_handler = e => {
    		dispatch("click", e);
    	};

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('state' in $$props) $$invalidate(4, state = $$props.state);
    		if ('deactivate' in $$props) $$invalidate(5, deactivate = $$props.deactivate);
    		if ('svg' in $$props) $$invalidate(1, svg = $$props.svg);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		name,
    		state,
    		deactivate,
    		svg,
    		activeClass,
    		dispatch,
    		iconsInfo,
    		info,
    		className
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('state' in $$props) $$invalidate(4, state = $$props.state);
    		if ('deactivate' in $$props) $$invalidate(5, deactivate = $$props.deactivate);
    		if ('svg' in $$props) $$invalidate(1, svg = $$props.svg);
    		if ('activeClass' in $$props) activeClass = $$props.activeClass;
    		if ('iconsInfo' in $$props) iconsInfo = $$props.iconsInfo;
    		if ('info' in $$props) info = $$props.info;
    		if ('className' in $$props) $$invalidate(2, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		svg,
    		className,
    		dispatch,
    		state,
    		deactivate,
    		mousedown_handler,
    		click_handler
    	];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { name: 0, state: 4, deactivate: 5, svg: 1 }, add_css$8);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set deactivate(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get svg() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set svg(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var fieldTypes = [{name:"text",type:"text",label:"Text","default":"",placeholder:"one line text"},{name:"color",type:"color_picker",label:"Color","default":"",placeholder:"Select Color"},{name:"textarea",type:"textarea",label:"Textarea","default":"",placeholder:"multiple line text input"},{name:"checkbox",type:"checkbox",label:"Checkbox Switch","default":false},{name:"dropdown",type:"dropdown",label:"Dropdown",options:[{text:"Option 1",key:"1"}],"default":""},{name:"model",type:"pre_filled_dropdown",label:"Model","default":""},{name:"slider",type:"slider",label:"Slider",options:[],"default":1,min:1,max:20,step:1},{name:"number",type:"number",label:"Number",options:[],"default":1,min:1,max:20,step:1},{name:"print",type:"text_output",html:""},{name:"my_layer",type:"layer_image"},{name:"currentLayer",type:"layer_image",menu_type:"currentLayer"},{name:"dropLayer",label:"Drop Layer",num_layers:1,type:"drop_layers",menu_type:"currentLayer"},{name:"preview",type:"checkbox",label:"Preview","default":"true",hidden:"true",menu_type:"Preview"},{name:"magnifier",type:"magnifier"},{name:"newLayer",type:"checkbox",label:"New Layer","default":"true",hidden:"true",menu_type:"addLayer"},{name:"advanced_options",type:"advanced_options"},{name:"num_images",type:"slider",label:"Number Images",options:[],"default":1,min:1,max:4,step:1,menu_type:"numberImages"},{name:"seed",type:"text",label:"Seed","default":"",placeholder:"Random if empty",menu_type:"Seed"}];

    /* src\fieldSelector.svelte generated by Svelte v3.59.2 */
    const file$6 = "src\\fieldSelector.svelte";

    function add_css$7(target) {
    	append_styles(target, "svelte-5g3ox4", "#fieldSelector.svelte-5g3ox4.svelte-5g3ox4{z-index:200;position:fixed;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:10px;background-color:black;backdrop-filter:blur(20px) brightness(80%);box-shadow:0 0 1rem 0 rgba(255, 255, 255, 0.2);color:white;display:block;border-radius:10px;font-size:14px;display:none;width:460px;padding-left:20px}#fieldSelector.svelte-5g3ox4 h1.svelte-5g3ox4{font-size:16px;margin:0 ;margin-bottom:10px}.field.svelte-5g3ox4.svelte-5g3ox4{cursor:pointer;padding:5px;background-color:rgb(60, 60, 60);width:200px;display:inline-block;margin-right:10px;margin-bottom:10px}.field.svelte-5g3ox4.svelte-5g3ox4:hover{background-color:rgb(227, 206, 116);color:black;fill:black}.field.svelte-5g3ox4 span.svelte-5g3ox4{font-size:16px;margin-left:20px;vertical-align:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRTZWxlY3Rvci5zdmVsdGUiLCJzb3VyY2VzIjpbImZpZWxkU2VsZWN0b3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG48c2NyaXB0PlxyXG4gICAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJ1xyXG4gICAgaW1wb3J0IEljb24gZnJvbSAnLi9JY29uLnN2ZWx0ZSdcclxuICAgIGltcG9ydCBmaWVsZFR5cGVzICBmcm9tICcuL2Zvcm1fdGVtcGxhdGVzL2ZpZWxkVHlwZXMuanNvbidcclxuXHJcbiAgICBleHBvcnQgbGV0IGN1c3RvbV91aV9jb21wb25lbnRzXHJcbiAgICBjb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpXHJcbiAgICBsZXQgc2hvd0ZpZWxkU2VsZWN0b3I9XCJub25lXCJcclxuICAgIFxyXG4gICAgbGV0IGxlZnQ9XCIxMDBweFwiXHJcbiAgICBsZXQgdG9wPVwiMTAwcHhcIlxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG9wZW5EaWFsb2coZSxwb3NYLHBvc1kpIHtcclxuICAgICAgICBzaG93RmllbGRTZWxlY3Rvcj1cImJsb2NrXCJcclxuICAgICAgICBsZXQgeD1lLmNsaWVudFgtNDYwLzItcG9zWFxyXG4gICAgICAgIGxldCB5PWUuY2xpZW50WS01NjAtcG9zWVxyXG4gICAgICAgIGlmICh4PDApIHg9MFxyXG4gICAgICAgIGlmICh5PDApIHk9MFxyXG4gICAgICAgIGlmICh4KzQ2MD53aW5kb3cuaW5uZXJXaWR0aCkgeD13aW5kb3cuaW5uZXJXaWR0aC00NjBcclxuICAgICAgICBpZiAoeSs1NjA+d2luZG93LmlubmVySGVpZ2h0KSB5PXdpbmRvdy5pbm5lckhlaWdodC01NjBcclxuICAgICAgICBsZWZ0PXgrXCJweFwiXHJcbiAgICAgICAgdG9wPXkrXCJweFwiICAgIFxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGhpZGVEaWFsb2coKSB7XHJcbiAgICAgICAgc2hvd0ZpZWxkU2VsZWN0b3I9XCJub25lXCJcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGZpbmRGaWVsZEJ5VHlwZSh0eXBlKSB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxmaWVsZFR5cGVzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgbGV0IGZpZWxkPWZpZWxkVHlwZXNbaV1cclxuICAgICAgICAgICAgaWYgKGZpZWxkLm1lbnVfdHlwZT09PXR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkPUpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZmllbGQpKVxyXG4gICAgICAgICAgICAgICAgZmllbGQubWVudV90eXBlPW51bGxcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmaWVsZC50eXBlPT09dHlwZSkgcmV0dXJuIGZpZWxkXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2VsZWN0RWxlbWVudCh0eXBlLGN1c3RvbUVsZW1lbnQ9bnVsbCkge1xyXG4gICAgICAgIGlmIChjdXN0b21FbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGN1c3RvbUVsZW1lbnQuY3VzdG9tPXRydWVcclxuICAgICAgICAgICAgZGlzcGF0Y2goJ3NlbGVjdCcsIGN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZmllbGQ9ZmluZEZpZWxkQnlUeXBlKHR5cGUpXHJcbiAgICAgICAgaWYgKCFmaWVsZCkge1xyXG4gICAgICAgICAgICBhbGVydChcImZpZWxkIHR5cGUgXCIrdHlwZStcIiBub3QgZm91bmRcIilcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BhdGNoKCdzZWxlY3QnLCBmaWVsZClcclxuICAgIH0gICBcclxuICAgIDwvc2NyaXB0PlxyXG4gICAgPHN0eWxlPlxyXG4gICAgICAgICNmaWVsZFNlbGVjdG9yIHtcclxuICAgICAgICAgICAgei1pbmRleDogMjAwO1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDIwcHgpIGJyaWdodG5lc3MoODAlKTtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDFyZW0gMCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7XHJcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgICAgZGlzcGxheTpub25lO1xyXG4gICAgICAgICAgICB3aWR0aDo0NjBweDtcclxuICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAyMHB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICAjZmllbGRTZWxlY3RvciBoMSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgICAgbWFyZ2luOjAgO1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICAuZmllbGQge1xyXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDVweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIHJnYig2MCwgNjAsIDYwKTtcclxuICAgICAgICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLmZpZWxkOmhvdmVyIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gICAgICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgICAgIGZpbGw6IGJsYWNrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAuZmllbGQgc3BhbiB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDIwcHg7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiAxMHB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICA8L3N0eWxlPlxyXG5cclxuXHJcbjxkaXYgaWQ9XCJmaWVsZFNlbGVjdG9yXCIgc3R5bGU9XCJkaXNwbGF5OntzaG93RmllbGRTZWxlY3Rvcn07bGVmdDp7bGVmdH07dG9wOnt0b3B9XCIgPlxyXG4gICAgPGgxPkFkZCBGb3JtIEZpZWxkPC9oMT5cclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHsgc2VsZWN0RWxlbWVudChcInRleHRcIil9fT5cclxuICAgICAgICA8SWNvbiBuYW1lPVwiZm9ybV90ZXh0XCIgPjwvSWNvbj48c3Bhbj5UZXh0PC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPiAgICBcclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiIG9uOmNsaWNrPXsoZSkgPT4ge3NlbGVjdEVsZW1lbnQoXCJ0ZXh0YXJlYVwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX3RleHRhcmVhXCIgPjwvSWNvbj48c3Bhbj5UZXh0YXJlYTwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwiY2hlY2tib3hcIil9fT5cclxuICAgICAgICA8SWNvbiBuYW1lPVwiZm9ybV9jaGVja2JveFwiID48L0ljb24+PHNwYW4+U3dpdGNoPC9zcGFuPlxyXG4gICAgPC9kaXY+ICBcclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+ICAgIFxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkXCIgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcImRyb3Bkb3duXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fZHJvcGRvd25cIiA+PC9JY29uPjxzcGFuPlNlbGVjdDwvc3Bhbj5cclxuICAgIDwvZGl2PiAgXHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPiAgICBcclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiIG9uOmNsaWNrPXsoZSkgPT4ge3NlbGVjdEVsZW1lbnQoXCJwcmVfZmlsbGVkX2Ryb3Bkb3duXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fZHJvcGRvd25cIiA+PC9JY29uPjxzcGFuPkF1dG9maWxsIFNlbGVjdDwvc3Bhbj5cclxuICAgIDwvZGl2PiAgICAgIFxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwic2xpZGVyXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fc2xpZGVyXCIgPjwvSWNvbj48c3Bhbj5TbGlkZXI8L3NwYW4+XHJcbiAgICA8L2Rpdj4gICAgIFxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiAgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcIm51bWJlclwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX3RleHRcIj48L0ljb24+PHNwYW4+TnVtYmVyPC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgICBcclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHsgc2VsZWN0RWxlbWVudChcImNvbG9yX3BpY2tlclwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX2NvbG9ycGlja2VyXCIgPjwvSWNvbj48c3Bhbj5Db2xvciBQaWNrZXI8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHsgc2VsZWN0RWxlbWVudChcInRleHRfb3V0cHV0XCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fdGV4dF9vdXRwdXRcIiA+PC9JY29uPjxzcGFuPlRleHQgT3V0cHV0PC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgIFxyXG4gICAgPGgxPlNwZWNpYWwgZmllbGRzPC9oMT5cclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+ICAgIFxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkXCIgIG9uOmNsaWNrPXsoZSkgPT4ge3NlbGVjdEVsZW1lbnQoXCJsYXllcl9pbWFnZVwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX2xheWVyc1wiPjwvSWNvbj48c3Bhbj5MYXllciBJbWFnZTwvc3Bhbj5cclxuICAgIDwvZGl2PiAgICAgXHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPiAgICBcclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiICBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwiZHJvcF9sYXllcnNcIil9fT5cclxuICAgICAgICA8SWNvbiBuYW1lPVwiZm9ybV9sYXllcnNcIj48L0ljb24+PHNwYW4+RHJvcCBMYXllcnM8L3NwYW4+XHJcbiAgICA8L2Rpdj4gICAgICAgIFxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwiY3VycmVudExheWVyXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fbGF5ZXJzMlwiID48L0ljb24+PHNwYW4+U2VsZWN0ZWQgTGF5ZXI8L3NwYW4+XHJcbiAgICA8L2Rpdj4gICAgICAgIFxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwiUHJldmlld1wiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX3ByZXZpZXdcIiA+PC9JY29uPjxzcGFuPlByZXZpZXc8L3NwYW4+XHJcbiAgICA8L2Rpdj4gICBcclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+ICAgIFxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkXCIgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcIm1hZ25pZmllclwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX21hZ25pZmllclwiID48L0ljb24+PHNwYW4+TWFnbmlmaWVyPC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgICBcclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+ICAgIFxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkXCIgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcImFkZExheWVyXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fbGF5ZXJzM1wiID48L0ljb24+PHNwYW4+QWRkIExheWVyPC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgICAgICAgXHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPiAgICBcclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiIG9uOmNsaWNrPXsoZSkgPT4ge3NlbGVjdEVsZW1lbnQoXCJhZHZhbmNlZF9vcHRpb25zXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fYWR2YW5jZWRcIiA+PC9JY29uPjxzcGFuPkFkdmFuY2VkIE9wdGlvbnM8L3NwYW4+XHJcbiAgICA8L2Rpdj4gICAgICAgICAgIFxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwibnVtYmVySW1hZ2VzXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fc2xpZGVyXCIgPjwvSWNvbj48c3Bhbj4jIFJlc3VsdCBJbWFnZXM8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+ICAgIFxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkXCIgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcIlNlZWRcIil9fT5cclxuICAgICAgICA8SWNvbiBuYW1lPVwiZm9ybV90ZXh0XCIgPjwvSWNvbj48c3Bhbj5TZWVkPC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgXHJcbiAgICA8aDE+RnJvbSBFeHRlbnNpb25zPC9oMT4gICAgICAgXHJcbiAgICB7I2VhY2ggY3VzdG9tX3VpX2NvbXBvbmVudHMgYXMgdWlfZWxlbWVudH1cclxuICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiIG9uOmNsaWNrPXsoZSkgPT4ge3NlbGVjdEVsZW1lbnQodWlfZWxlbWVudC50YWcsdWlfZWxlbWVudCl9fT5cclxuICAgICAgICAgICAgICAgIHsjaWYgdWlfZWxlbWVudC5pY29ufTxJY29uIHN2Zz17dWlfZWxlbWVudC5pY29ufSA+PC9JY29uPnsvaWZ9PHNwYW4+e3VpX2VsZW1lbnQubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PiBcclxuICAgIHsvZWFjaH1cclxuPC9kaXY+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFvRFEsMENBQWUsQ0FDWCxPQUFPLENBQUUsR0FBRyxDQUNaLFFBQVEsQ0FBRSxLQUFLLENBQ2YsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksT0FBTyxDQUFFLElBQUksQ0FDYixnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLGVBQWUsQ0FBRSxLQUFLLElBQUksQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQzNDLFVBQVUsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDL0MsS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsS0FBSyxDQUNkLGFBQWEsQ0FBRSxJQUFJLENBQ25CLFNBQVMsQ0FBRSxJQUFJLENBQ2YsUUFBUSxJQUFJLENBQ1osTUFBTSxLQUFLLENBQ1gsWUFBWSxDQUFFLElBQ2xCLENBQ0EsNEJBQWMsQ0FBQyxnQkFBRyxDQUNkLFNBQVMsQ0FBRSxJQUFJLENBQ2YsT0FBTyxDQUFDLENBQUMsQ0FDVCxhQUFhLENBQUUsSUFDbkIsQ0FDQSxrQ0FBTyxDQUNILE1BQU0sQ0FBRSxPQUFPLENBQ2YsT0FBTyxDQUFFLEdBQUcsQ0FDWixnQkFBZ0IsQ0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNsQyxLQUFLLENBQUUsS0FBSyxDQUNaLE9BQU8sQ0FBRSxZQUFZLENBQ3JCLFlBQVksQ0FBRSxJQUFJLENBQ2xCLGFBQWEsQ0FBRSxJQUNuQixDQUNBLGtDQUFNLE1BQU8sQ0FDVCxnQkFBZ0IsQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxLQUFLLENBQUUsS0FBSyxDQUNaLElBQUksQ0FBRSxLQUNWLENBQ0Esb0JBQU0sQ0FBQyxrQkFBSyxDQUNSLFNBQVMsQ0FBRSxJQUFJLENBQ2YsV0FBVyxDQUFFLElBQUksQ0FDakIsY0FBYyxDQUFFLElBQ3BCIn0= */");
    }

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    // (175:16) {#if ui_element.icon}
    function create_if_block$6(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { svg: /*ui_element*/ ctx[28].icon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*custom_ui_components*/ 1) icon_changes.svg = /*ui_element*/ ctx[28].icon;
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(175:16) {#if ui_element.icon}",
    		ctx
    	});

    	return block;
    }

    // (172:4) {#each custom_ui_components as ui_element}
    function create_each_block$6(ctx) {
    	let div;
    	let span;
    	let t0_value = /*ui_element*/ ctx[28].name + "";
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*ui_element*/ ctx[28].icon && create_if_block$6(ctx);

    	function click_handler_18(...args) {
    		return /*click_handler_18*/ ctx[25](/*ui_element*/ ctx[28], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "svelte-5g3ox4");
    			add_location(span, file$6, 174, 78, 7346);
    			attr_dev(div, "class", "field svelte-5g3ox4");
    			add_location(div, file$6, 173, 12, 7186);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_18, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*ui_element*/ ctx[28].icon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*custom_ui_components*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, span);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*custom_ui_components*/ 1) && t0_value !== (t0_value = /*ui_element*/ ctx[28].name + "")) set_data_dev(t0, t0_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(172:4) {#each custom_ui_components as ui_element}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div18;
    	let h10;
    	let t1;
    	let div0;
    	let icon0;
    	let span0;
    	let t3;
    	let div1;
    	let icon1;
    	let span1;
    	let t5;
    	let div2;
    	let icon2;
    	let span2;
    	let t7;
    	let div3;
    	let icon3;
    	let span3;
    	let t9;
    	let div4;
    	let icon4;
    	let span4;
    	let t11;
    	let div5;
    	let icon5;
    	let span5;
    	let t13;
    	let div6;
    	let icon6;
    	let span6;
    	let t15;
    	let div7;
    	let icon7;
    	let span7;
    	let t17;
    	let div8;
    	let icon8;
    	let span8;
    	let t19;
    	let h11;
    	let t21;
    	let div9;
    	let icon9;
    	let span9;
    	let t23;
    	let div10;
    	let icon10;
    	let span10;
    	let t25;
    	let div11;
    	let icon11;
    	let span11;
    	let t27;
    	let div12;
    	let icon12;
    	let span12;
    	let t29;
    	let div13;
    	let icon13;
    	let span13;
    	let t31;
    	let div14;
    	let icon14;
    	let span14;
    	let t33;
    	let div15;
    	let icon15;
    	let span15;
    	let t35;
    	let div16;
    	let icon16;
    	let span16;
    	let t37;
    	let div17;
    	let icon17;
    	let span17;
    	let t39;
    	let h12;
    	let t41;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { name: "form_text" },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { name: "form_textarea" },
    			$$inline: true
    		});

    	icon2 = new Icon({
    			props: { name: "form_checkbox" },
    			$$inline: true
    		});

    	icon3 = new Icon({
    			props: { name: "form_dropdown" },
    			$$inline: true
    		});

    	icon4 = new Icon({
    			props: { name: "form_dropdown" },
    			$$inline: true
    		});

    	icon5 = new Icon({
    			props: { name: "form_slider" },
    			$$inline: true
    		});

    	icon6 = new Icon({
    			props: { name: "form_text" },
    			$$inline: true
    		});

    	icon7 = new Icon({
    			props: { name: "form_colorpicker" },
    			$$inline: true
    		});

    	icon8 = new Icon({
    			props: { name: "form_text_output" },
    			$$inline: true
    		});

    	icon9 = new Icon({
    			props: { name: "form_layers" },
    			$$inline: true
    		});

    	icon10 = new Icon({
    			props: { name: "form_layers" },
    			$$inline: true
    		});

    	icon11 = new Icon({
    			props: { name: "form_layers2" },
    			$$inline: true
    		});

    	icon12 = new Icon({
    			props: { name: "form_preview" },
    			$$inline: true
    		});

    	icon13 = new Icon({
    			props: { name: "form_magnifier" },
    			$$inline: true
    		});

    	icon14 = new Icon({
    			props: { name: "form_layers3" },
    			$$inline: true
    		});

    	icon15 = new Icon({
    			props: { name: "form_advanced" },
    			$$inline: true
    		});

    	icon16 = new Icon({
    			props: { name: "form_slider" },
    			$$inline: true
    		});

    	icon17 = new Icon({
    			props: { name: "form_text" },
    			$$inline: true
    		});

    	let each_value = /*custom_ui_components*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div18 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Add Form Field";
    			t1 = space();
    			div0 = element("div");
    			create_component(icon0.$$.fragment);
    			span0 = element("span");
    			span0.textContent = "Text";
    			t3 = space();
    			div1 = element("div");
    			create_component(icon1.$$.fragment);
    			span1 = element("span");
    			span1.textContent = "Textarea";
    			t5 = space();
    			div2 = element("div");
    			create_component(icon2.$$.fragment);
    			span2 = element("span");
    			span2.textContent = "Switch";
    			t7 = space();
    			div3 = element("div");
    			create_component(icon3.$$.fragment);
    			span3 = element("span");
    			span3.textContent = "Select";
    			t9 = space();
    			div4 = element("div");
    			create_component(icon4.$$.fragment);
    			span4 = element("span");
    			span4.textContent = "Autofill Select";
    			t11 = space();
    			div5 = element("div");
    			create_component(icon5.$$.fragment);
    			span5 = element("span");
    			span5.textContent = "Slider";
    			t13 = space();
    			div6 = element("div");
    			create_component(icon6.$$.fragment);
    			span6 = element("span");
    			span6.textContent = "Number";
    			t15 = space();
    			div7 = element("div");
    			create_component(icon7.$$.fragment);
    			span7 = element("span");
    			span7.textContent = "Color Picker";
    			t17 = space();
    			div8 = element("div");
    			create_component(icon8.$$.fragment);
    			span8 = element("span");
    			span8.textContent = "Text Output";
    			t19 = space();
    			h11 = element("h1");
    			h11.textContent = "Special fields";
    			t21 = space();
    			div9 = element("div");
    			create_component(icon9.$$.fragment);
    			span9 = element("span");
    			span9.textContent = "Layer Image";
    			t23 = space();
    			div10 = element("div");
    			create_component(icon10.$$.fragment);
    			span10 = element("span");
    			span10.textContent = "Drop Layers";
    			t25 = space();
    			div11 = element("div");
    			create_component(icon11.$$.fragment);
    			span11 = element("span");
    			span11.textContent = "Selected Layer";
    			t27 = space();
    			div12 = element("div");
    			create_component(icon12.$$.fragment);
    			span12 = element("span");
    			span12.textContent = "Preview";
    			t29 = space();
    			div13 = element("div");
    			create_component(icon13.$$.fragment);
    			span13 = element("span");
    			span13.textContent = "Magnifier";
    			t31 = space();
    			div14 = element("div");
    			create_component(icon14.$$.fragment);
    			span14 = element("span");
    			span14.textContent = "Add Layer";
    			t33 = space();
    			div15 = element("div");
    			create_component(icon15.$$.fragment);
    			span15 = element("span");
    			span15.textContent = "Advanced Options";
    			t35 = space();
    			div16 = element("div");
    			create_component(icon16.$$.fragment);
    			span16 = element("span");
    			span16.textContent = "# Result Images";
    			t37 = space();
    			div17 = element("div");
    			create_component(icon17.$$.fragment);
    			span17 = element("span");
    			span17.textContent = "Seed";
    			t39 = space();
    			h12 = element("h1");
    			h12.textContent = "From Extensions";
    			t41 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h10, "class", "svelte-5g3ox4");
    			add_location(h10, file$6, 96, 4, 2986);
    			attr_dev(span0, "class", "svelte-5g3ox4");
    			add_location(span0, file$6, 99, 39, 3180);
    			attr_dev(div0, "class", "field svelte-5g3ox4");
    			add_location(div0, file$6, 98, 4, 3077);
    			attr_dev(span1, "class", "svelte-5g3ox4");
    			add_location(span1, file$6, 103, 43, 3391);
    			attr_dev(div1, "class", "field svelte-5g3ox4");
    			add_location(div1, file$6, 102, 4, 3281);
    			attr_dev(span2, "class", "svelte-5g3ox4");
    			add_location(span2, file$6, 107, 43, 3606);
    			attr_dev(div2, "class", "field svelte-5g3ox4");
    			add_location(div2, file$6, 106, 4, 3496);
    			attr_dev(span3, "class", "svelte-5g3ox4");
    			add_location(span3, file$6, 111, 43, 3821);
    			attr_dev(div3, "class", "field svelte-5g3ox4");
    			add_location(div3, file$6, 110, 4, 3711);
    			attr_dev(span4, "class", "svelte-5g3ox4");
    			add_location(span4, file$6, 115, 43, 4047);
    			attr_dev(div4, "class", "field svelte-5g3ox4");
    			add_location(div4, file$6, 114, 4, 3926);
    			attr_dev(span5, "class", "svelte-5g3ox4");
    			add_location(span5, file$6, 119, 41, 4271);
    			attr_dev(div5, "class", "field svelte-5g3ox4");
    			add_location(div5, file$6, 118, 4, 4165);
    			attr_dev(span6, "class", "svelte-5g3ox4");
    			add_location(span6, file$6, 123, 38, 4483);
    			attr_dev(div6, "class", "field svelte-5g3ox4");
    			add_location(div6, file$6, 122, 4, 4379);
    			attr_dev(span7, "class", "svelte-5g3ox4");
    			add_location(span7, file$6, 127, 46, 4705);
    			attr_dev(div7, "class", "field svelte-5g3ox4");
    			add_location(div7, file$6, 126, 4, 4587);
    			attr_dev(span8, "class", "svelte-5g3ox4");
    			add_location(span8, file$6, 131, 46, 4927);
    			attr_dev(div8, "class", "field svelte-5g3ox4");
    			add_location(div8, file$6, 130, 4, 4810);
    			attr_dev(h11, "class", "svelte-5g3ox4");
    			add_location(h11, file$6, 133, 4, 4973);
    			attr_dev(span9, "class", "svelte-5g3ox4");
    			add_location(span9, file$6, 136, 40, 5179);
    			attr_dev(div9, "class", "field svelte-5g3ox4");
    			add_location(div9, file$6, 135, 4, 5068);
    			attr_dev(span10, "class", "svelte-5g3ox4");
    			add_location(span10, file$6, 140, 40, 5403);
    			attr_dev(div10, "class", "field svelte-5g3ox4");
    			add_location(div10, file$6, 139, 4, 5292);
    			attr_dev(span11, "class", "svelte-5g3ox4");
    			add_location(span11, file$6, 144, 42, 5632);
    			attr_dev(div11, "class", "field svelte-5g3ox4");
    			add_location(div11, file$6, 143, 4, 5519);
    			attr_dev(span12, "class", "svelte-5g3ox4");
    			add_location(span12, file$6, 148, 42, 5859);
    			attr_dev(div12, "class", "field svelte-5g3ox4");
    			add_location(div12, file$6, 147, 4, 5751);
    			attr_dev(span13, "class", "svelte-5g3ox4");
    			add_location(span13, file$6, 152, 44, 6078);
    			attr_dev(div13, "class", "field svelte-5g3ox4");
    			add_location(div13, file$6, 151, 4, 5966);
    			attr_dev(span14, "class", "svelte-5g3ox4");
    			add_location(span14, file$6, 156, 42, 6298);
    			attr_dev(div14, "class", "field svelte-5g3ox4");
    			add_location(div14, file$6, 155, 4, 6189);
    			attr_dev(span15, "class", "svelte-5g3ox4");
    			add_location(span15, file$6, 160, 43, 6531);
    			attr_dev(div15, "class", "field svelte-5g3ox4");
    			add_location(div15, file$6, 159, 4, 6413);
    			attr_dev(span16, "class", "svelte-5g3ox4");
    			add_location(span16, file$6, 164, 41, 6767);
    			attr_dev(div16, "class", "field svelte-5g3ox4");
    			add_location(div16, file$6, 163, 4, 6655);
    			attr_dev(span17, "class", "svelte-5g3ox4");
    			add_location(span17, file$6, 168, 39, 6981);
    			attr_dev(div17, "class", "field svelte-5g3ox4");
    			add_location(div17, file$6, 167, 4, 6879);
    			attr_dev(h12, "class", "svelte-5g3ox4");
    			add_location(h12, file$6, 170, 4, 7019);
    			attr_dev(div18, "id", "fieldSelector");
    			set_style(div18, "display", /*showFieldSelector*/ ctx[1]);
    			set_style(div18, "left", /*left*/ ctx[2]);
    			set_style(div18, "top", /*top*/ ctx[3]);
    			attr_dev(div18, "class", "svelte-5g3ox4");
    			add_location(div18, file$6, 95, 0, 2897);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div18, anchor);
    			append_dev(div18, h10);
    			append_dev(div18, t1);
    			append_dev(div18, div0);
    			mount_component(icon0, div0, null);
    			append_dev(div0, span0);
    			append_dev(div18, t3);
    			append_dev(div18, div1);
    			mount_component(icon1, div1, null);
    			append_dev(div1, span1);
    			append_dev(div18, t5);
    			append_dev(div18, div2);
    			mount_component(icon2, div2, null);
    			append_dev(div2, span2);
    			append_dev(div18, t7);
    			append_dev(div18, div3);
    			mount_component(icon3, div3, null);
    			append_dev(div3, span3);
    			append_dev(div18, t9);
    			append_dev(div18, div4);
    			mount_component(icon4, div4, null);
    			append_dev(div4, span4);
    			append_dev(div18, t11);
    			append_dev(div18, div5);
    			mount_component(icon5, div5, null);
    			append_dev(div5, span5);
    			append_dev(div18, t13);
    			append_dev(div18, div6);
    			mount_component(icon6, div6, null);
    			append_dev(div6, span6);
    			append_dev(div18, t15);
    			append_dev(div18, div7);
    			mount_component(icon7, div7, null);
    			append_dev(div7, span7);
    			append_dev(div18, t17);
    			append_dev(div18, div8);
    			mount_component(icon8, div8, null);
    			append_dev(div8, span8);
    			append_dev(div18, t19);
    			append_dev(div18, h11);
    			append_dev(div18, t21);
    			append_dev(div18, div9);
    			mount_component(icon9, div9, null);
    			append_dev(div9, span9);
    			append_dev(div18, t23);
    			append_dev(div18, div10);
    			mount_component(icon10, div10, null);
    			append_dev(div10, span10);
    			append_dev(div18, t25);
    			append_dev(div18, div11);
    			mount_component(icon11, div11, null);
    			append_dev(div11, span11);
    			append_dev(div18, t27);
    			append_dev(div18, div12);
    			mount_component(icon12, div12, null);
    			append_dev(div12, span12);
    			append_dev(div18, t29);
    			append_dev(div18, div13);
    			mount_component(icon13, div13, null);
    			append_dev(div13, span13);
    			append_dev(div18, t31);
    			append_dev(div18, div14);
    			mount_component(icon14, div14, null);
    			append_dev(div14, span14);
    			append_dev(div18, t33);
    			append_dev(div18, div15);
    			mount_component(icon15, div15, null);
    			append_dev(div15, span15);
    			append_dev(div18, t35);
    			append_dev(div18, div16);
    			mount_component(icon16, div16, null);
    			append_dev(div16, span16);
    			append_dev(div18, t37);
    			append_dev(div18, div17);
    			mount_component(icon17, div17, null);
    			append_dev(div17, span17);
    			append_dev(div18, t39);
    			append_dev(div18, h12);
    			append_dev(div18, t41);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div18, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[7], false, false, false, false),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[8], false, false, false, false),
    					listen_dev(div2, "click", /*click_handler_2*/ ctx[9], false, false, false, false),
    					listen_dev(div3, "click", /*click_handler_3*/ ctx[10], false, false, false, false),
    					listen_dev(div4, "click", /*click_handler_4*/ ctx[11], false, false, false, false),
    					listen_dev(div5, "click", /*click_handler_5*/ ctx[12], false, false, false, false),
    					listen_dev(div6, "click", /*click_handler_6*/ ctx[13], false, false, false, false),
    					listen_dev(div7, "click", /*click_handler_7*/ ctx[14], false, false, false, false),
    					listen_dev(div8, "click", /*click_handler_8*/ ctx[15], false, false, false, false),
    					listen_dev(div9, "click", /*click_handler_9*/ ctx[16], false, false, false, false),
    					listen_dev(div10, "click", /*click_handler_10*/ ctx[17], false, false, false, false),
    					listen_dev(div11, "click", /*click_handler_11*/ ctx[18], false, false, false, false),
    					listen_dev(div12, "click", /*click_handler_12*/ ctx[19], false, false, false, false),
    					listen_dev(div13, "click", /*click_handler_13*/ ctx[20], false, false, false, false),
    					listen_dev(div14, "click", /*click_handler_14*/ ctx[21], false, false, false, false),
    					listen_dev(div15, "click", /*click_handler_15*/ ctx[22], false, false, false, false),
    					listen_dev(div16, "click", /*click_handler_16*/ ctx[23], false, false, false, false),
    					listen_dev(div17, "click", /*click_handler_17*/ ctx[24], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selectElement, custom_ui_components*/ 17) {
    				each_value = /*custom_ui_components*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div18, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*showFieldSelector*/ 2) {
    				set_style(div18, "display", /*showFieldSelector*/ ctx[1]);
    			}

    			if (!current || dirty & /*left*/ 4) {
    				set_style(div18, "left", /*left*/ ctx[2]);
    			}

    			if (!current || dirty & /*top*/ 8) {
    				set_style(div18, "top", /*top*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			transition_in(icon3.$$.fragment, local);
    			transition_in(icon4.$$.fragment, local);
    			transition_in(icon5.$$.fragment, local);
    			transition_in(icon6.$$.fragment, local);
    			transition_in(icon7.$$.fragment, local);
    			transition_in(icon8.$$.fragment, local);
    			transition_in(icon9.$$.fragment, local);
    			transition_in(icon10.$$.fragment, local);
    			transition_in(icon11.$$.fragment, local);
    			transition_in(icon12.$$.fragment, local);
    			transition_in(icon13.$$.fragment, local);
    			transition_in(icon14.$$.fragment, local);
    			transition_in(icon15.$$.fragment, local);
    			transition_in(icon16.$$.fragment, local);
    			transition_in(icon17.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			transition_out(icon3.$$.fragment, local);
    			transition_out(icon4.$$.fragment, local);
    			transition_out(icon5.$$.fragment, local);
    			transition_out(icon6.$$.fragment, local);
    			transition_out(icon7.$$.fragment, local);
    			transition_out(icon8.$$.fragment, local);
    			transition_out(icon9.$$.fragment, local);
    			transition_out(icon10.$$.fragment, local);
    			transition_out(icon11.$$.fragment, local);
    			transition_out(icon12.$$.fragment, local);
    			transition_out(icon13.$$.fragment, local);
    			transition_out(icon14.$$.fragment, local);
    			transition_out(icon15.$$.fragment, local);
    			transition_out(icon16.$$.fragment, local);
    			transition_out(icon17.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div18);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(icon2);
    			destroy_component(icon3);
    			destroy_component(icon4);
    			destroy_component(icon5);
    			destroy_component(icon6);
    			destroy_component(icon7);
    			destroy_component(icon8);
    			destroy_component(icon9);
    			destroy_component(icon10);
    			destroy_component(icon11);
    			destroy_component(icon12);
    			destroy_component(icon13);
    			destroy_component(icon14);
    			destroy_component(icon15);
    			destroy_component(icon16);
    			destroy_component(icon17);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('FieldSelector', slots, []);
    	let { custom_ui_components } = $$props;
    	const dispatch = createEventDispatcher();
    	let showFieldSelector = "none";
    	let left = "100px";
    	let top = "100px";

    	function openDialog(e, posX, posY) {
    		$$invalidate(1, showFieldSelector = "block");
    		let x = e.clientX - 460 / 2 - posX;
    		let y = e.clientY - 560 - posY;
    		if (x < 0) x = 0;
    		if (y < 0) y = 0;
    		if (x + 460 > window.innerWidth) x = window.innerWidth - 460;
    		if (y + 560 > window.innerHeight) y = window.innerHeight - 560;
    		$$invalidate(2, left = x + "px");
    		$$invalidate(3, top = y + "px");
    	}

    	function hideDialog() {
    		$$invalidate(1, showFieldSelector = "none");
    	}

    	function findFieldByType(type) {
    		for (let i = 0; i < fieldTypes.length; i++) {
    			let field = fieldTypes[i];

    			if (field.menu_type === type) {
    				field = JSON.parse(JSON.stringify(field));
    				field.menu_type = null;
    				return field;
    			}

    			if (field.type === type) return field;
    		}
    	}

    	function selectElement(type, customElement = null) {
    		if (customElement) {
    			customElement.custom = true;
    			dispatch('select', customElement);
    			return;
    		}

    		let field = findFieldByType(type);

    		if (!field) {
    			alert("field type " + type + " not found");
    			return;
    		}

    		dispatch('select', field);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (custom_ui_components === undefined && !('custom_ui_components' in $$props || $$self.$$.bound[$$self.$$.props['custom_ui_components']])) {
    			console.warn("<FieldSelector> was created without expected prop 'custom_ui_components'");
    		}
    	});

    	const writable_props = ['custom_ui_components'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FieldSelector> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		selectElement("text");
    	};

    	const click_handler_1 = e => {
    		selectElement("textarea");
    	};

    	const click_handler_2 = e => {
    		selectElement("checkbox");
    	};

    	const click_handler_3 = e => {
    		selectElement("dropdown");
    	};

    	const click_handler_4 = e => {
    		selectElement("pre_filled_dropdown");
    	};

    	const click_handler_5 = e => {
    		selectElement("slider");
    	};

    	const click_handler_6 = e => {
    		selectElement("number");
    	};

    	const click_handler_7 = e => {
    		selectElement("color_picker");
    	};

    	const click_handler_8 = e => {
    		selectElement("text_output");
    	};

    	const click_handler_9 = e => {
    		selectElement("layer_image");
    	};

    	const click_handler_10 = e => {
    		selectElement("drop_layers");
    	};

    	const click_handler_11 = e => {
    		selectElement("currentLayer");
    	};

    	const click_handler_12 = e => {
    		selectElement("Preview");
    	};

    	const click_handler_13 = e => {
    		selectElement("magnifier");
    	};

    	const click_handler_14 = e => {
    		selectElement("addLayer");
    	};

    	const click_handler_15 = e => {
    		selectElement("advanced_options");
    	};

    	const click_handler_16 = e => {
    		selectElement("numberImages");
    	};

    	const click_handler_17 = e => {
    		selectElement("Seed");
    	};

    	const click_handler_18 = (ui_element, e) => {
    		selectElement(ui_element.tag, ui_element);
    	};

    	$$self.$$set = $$props => {
    		if ('custom_ui_components' in $$props) $$invalidate(0, custom_ui_components = $$props.custom_ui_components);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Icon,
    		fieldTypes,
    		custom_ui_components,
    		dispatch,
    		showFieldSelector,
    		left,
    		top,
    		openDialog,
    		hideDialog,
    		findFieldByType,
    		selectElement
    	});

    	$$self.$inject_state = $$props => {
    		if ('custom_ui_components' in $$props) $$invalidate(0, custom_ui_components = $$props.custom_ui_components);
    		if ('showFieldSelector' in $$props) $$invalidate(1, showFieldSelector = $$props.showFieldSelector);
    		if ('left' in $$props) $$invalidate(2, left = $$props.left);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		custom_ui_components,
    		showFieldSelector,
    		left,
    		top,
    		selectElement,
    		openDialog,
    		hideDialog,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16,
    		click_handler_17,
    		click_handler_18
    	];
    }

    class FieldSelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				custom_ui_components: 0,
    				openDialog: 5,
    				hideDialog: 6
    			},
    			add_css$7
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldSelector",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get custom_ui_components() {
    		throw new Error("<FieldSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set custom_ui_components(value) {
    		throw new Error("<FieldSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openDialog() {
    		return this.$$.ctx[5];
    	}

    	set openDialog(value) {
    		throw new Error("<FieldSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideDialog() {
    		return this.$$.ctx[6];
    	}

    	set hideDialog(value) {
    		throw new Error("<FieldSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FormBuilder.svelte generated by Svelte v3.59.2 */
    const file$5 = "src\\FormBuilder.svelte";

    function add_css$6(target) {
    	append_styles(target, "svelte-1yl6ahv", ".formBuilder.svelte-1yl6ahv.svelte-1yl6ahv{padding:10px;color:white;width:470px;display:block}.formBuilder.svelte-1yl6ahv h1.svelte-1yl6ahv{font-size:16px;margin-bottom:30px}.draggable.svelte-1yl6ahv.svelte-1yl6ahv{cursor:grab}.form.svelte-1yl6ahv.svelte-1yl6ahv{border-radius:5px;background-color:black;width:450px;padding:10px;color:white;font:\"Segoe UI\", Roboto, system-ui;font-size:14px;margin-bottom:10px}.formBuilder.svelte-1yl6ahv button.svelte-1yl6ahv{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUJ1aWxkZXIuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtQnVpbGRlci5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICBpbXBvcnQgRm9ybUVsZW1lbnQgZnJvbSAnLi9Gb3JtRWxlbWVudC5zdmVsdGUnO1xyXG4gIGltcG9ydCB7IG1ldGFkYXRhfSBmcm9tICcuL3N0b3Jlcy9tZXRhZGF0YSdcclxuICBpbXBvcnQgeyBydWxlc0V4ZWN1dGlvbiB9IGZyb20gJy4vcnVsZXNFeGVjdXRpb24uanMnXHJcbiAgaW1wb3J0IGZvcm1UZW1wbGF0ZV9UeHQySW1hZ2UgIGZyb20gJy4vZm9ybV90ZW1wbGF0ZXMvdHh0MmltYWdlLmpzb24nXHJcbiAgaW1wb3J0IGZvcm1UZW1wbGF0ZV9MYXllck1lbnUgIGZyb20gJy4vZm9ybV90ZW1wbGF0ZXMvbGF5ZXJtZW51Lmpzb24nXHJcbiAgaW1wb3J0IHsgbWFwcGluZ3NIZWxwZXIgfSBmcm9tICcuL21hcHBpbmdzSGVscGVyLmpzJ1xyXG4gIGltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gXCIuL2ZpZWxkU2VsZWN0b3Iuc3ZlbHRlXCJcclxuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnXHJcbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gJ3N2ZWx0ZSc7XHJcblxyXG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKClcclxuXHJcbiAgaWYgKCEkbWV0YWRhdGEuZm9ybXMpICRtZXRhZGF0YS5mb3Jtcz17fVxyXG5cclxuICBleHBvcnQgbGV0IGZvcm1fa2V5PSdkZWZhdWx0JyAgLy8gc3VwcG9ydCBmb3IgbXVsdGlwbGUgZm9ybXMgKGUuZy4gd2l6YXJkcykgaW4gdGhlIGZ1dHVyZVxyXG4gIGV4cG9ydCBsZXQgZGF0YT17fSAgICAgICAgICAgIC8vIHRoZSBmb3JtIGRhdGFcclxuICBleHBvcnQgbGV0IHJlZnJlc2ggIFxyXG4gIGV4cG9ydCBsZXQgcG9zWCxwb3NZICAgICAgICAvLyBwb3NpdGlvbiBvZiB0aGUgcGFyZW50IGRpYWxvZ1xyXG4gIGV4cG9ydCBsZXQgY3VzdG9tX3VpX2NvbXBvbmVudHNcclxuICBleHBvcnQgbGV0IG5vX2VkaXQ9ZmFsc2VcclxuXHJcbiAgaWYgKCEkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldKSAkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldPXtlbGVtZW50czpbXX1cclxuICBpZiAoISRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV0uZWxlbWVudHMpICRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV0uZWxlbWVudHM9W11cclxuICBsZXQgZm9ybUVsZW1lbnRzID0gJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XS5lbGVtZW50c1xyXG4gIGVuc3VyZVVuaXF1ZU5hbWVzKClcclxuICBzZXREZWZhdWx0VmFsdWVzKClcclxuXHJcbiAgbGV0IGRyYWdTdGFydEluZGV4PS0xXHJcbiAgbGV0IHNob3dQcm9wZXJ0aWVzSWR4PS0xXHJcbiAgbGV0IHNlbGVjdGVkVHlwZVxyXG5cclxuICBmdW5jdGlvbiBlbnN1cmVVbmlxdWVOYW1lcygpIHtcclxuICBjb25zdCBuYW1lTWFwID0ge307IC8vIE9iamVjdCB0byBrZWVwIHRyYWNrIG9mIG5hbWVzIGFuZCB0aGVpciBvY2N1cnJlbmNlc1xyXG5cclxuICBmb3JtRWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgIGxldCBuYW1lID0gZWxlbWVudC5uYW1lO1xyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIG5hbWUgYWxyZWFkeSBleGlzdHMgaW4gdGhlIG5hbWVNYXBcclxuICAgIGlmIChuYW1lTWFwW25hbWVdKSB7XHJcbiAgICAgIC8vIElmIHRoZSBuYW1lIGV4aXN0cywgaW5jcmVtZW50IHRoZSBjb3VudCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBuYW1lXHJcbiAgICAgIGxldCBjb3VudCA9IG5hbWVNYXBbbmFtZV07XHJcbiAgICAgIGxldCBuZXdOYW1lID0gYCR7bmFtZX1fJHtjb3VudH1gO1xyXG4gICAgICB3aGlsZSAobmFtZU1hcFtuZXdOYW1lXSkgeyAvLyBFbnN1cmUgdGhlIG5ldyBuYW1lIGlzIGFsc28gdW5pcXVlXHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgICBuZXdOYW1lID0gYCR7bmFtZX1fJHtjb3VudH1gO1xyXG4gICAgICB9XHJcbiAgICAgIGVsZW1lbnQubmFtZSA9IG5ld05hbWU7XHJcbiAgICAgIG5hbWVNYXBbbmFtZV0rKztcclxuICAgICAgbmFtZU1hcFtuZXdOYW1lXSA9IDE7IC8vIEluaXRpYWxpemUgdGhpcyBuZXcgbmFtZSBpbiB0aGUgbmFtZU1hcFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gSWYgdGhlIG5hbWUgZG9lc24ndCBleGlzdCwgYWRkIGl0IHRvIHRoZSBuYW1lTWFwXHJcbiAgICAgIG5hbWVNYXBbbmFtZV0gPSAxXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG4gICQ6IHtcclxuICAgIGlmIChyZWZyZXNoKSB7XHJcbiAgICAgIGZvcihsZXQgaT0wO2k8Zm9ybUVsZW1lbnRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICBsZXQgZWxlbWVudD1mb3JtRWxlbWVudHNbaV1cclxuICAgICAgICBpZiAoIWRhdGFbZWxlbWVudC5uYW1lXSkgZGF0YVtlbGVtZW50Lm5hbWVdPWVsZW1lbnQuZGVmYXVsdFxyXG4gICAgICB9XHJcbiAgICAgIGZvcm1FbGVtZW50cz1mb3JtRWxlbWVudHNcclxuICAgIH1cclxuICB9XHJcbiAgb25Nb3VudCgoKSA9PiB7XHJcbiAgICBpZiAoIWRhdGEgfHwgIWZvcm1FbGVtZW50cykgcmV0dXJuXHJcblxyXG4gICAgbGV0IHJlPW5ldyBydWxlc0V4ZWN1dGlvbigpICAgIFxyXG4gICAgbGV0IHJlcz1yZS5leGVjdXRlKGRhdGEsZm9ybUVsZW1lbnRzLCRtZXRhZGF0YS5ydWxlcyx7XCJjb250cm9sbmV0XCI6MH0pXHJcbiAgICBpZiAoIXJlcykgcmV0dXJuXHJcbiAgICBkYXRhPXJlcy5kYXRhXHJcbiAgICBpZiAocmVzLmhpZGRlbkZpZWxkcy5sZW5ndGggfHwgcmVzLnNob3dGaWVsZHMubGVuZ3RoKSBmb3JtRWxlbWVudHM9Zm9ybUVsZW1lbnRzXHJcbiAgfSlcclxuXHJcbiAgZnVuY3Rpb24gYWRkRWxlbWVudChlKSB7XHJcbiAgICBmaWVsZFNlbGVjdG9yLmhpZGVEaWFsb2coKVxyXG4gICAgbGV0IG5ld0VsZW1lbnQ9ZS5kZXRhaWxcclxuICAgIGlmICghbmV3RWxlbWVudCkgcmV0dXJuXHJcbiAgICBpZiAobmV3RWxlbWVudC5jdXN0b20pIHsgICAgLy8gY3VzdG9tIGVsZW1lbnRcclxuICAgICAgbGV0IGZpZWxkPXtcclxuICAgICAgICB0eXBlOiBcImN1c3RvbVwiLFxyXG4gICAgICAgIHRhZzogbmV3RWxlbWVudC50YWcsXHJcbiAgICAgICAgbmFtZTogbmV3RWxlbWVudC5wYXJhbWV0ZXJzLm5hbWUuZGVmYXVsdCxcclxuICAgICAgICBsYWJlbDogbmV3RWxlbWVudC5wYXJhbWV0ZXJzLmxhYmVsLmRlZmF1bHQsXHJcbiAgICAgICAgZGVmYXVsdDogbmV3RWxlbWVudC5wYXJhbWV0ZXJzLmRlZmF1bHQuZGVmYXVsdCxcclxuICAgICAgICBwYXJhbWV0ZXJzOiBuZXdFbGVtZW50LnBhcmFtZXRlcnNcclxuICAgICAgfVxyXG4gICAgICBpZiAobmV3RWxlbWVudC5zcGxpdF92YWx1ZV9udW0pIGZpZWxkLnNwbGl0X3ZhbHVlX251bT1uZXdFbGVtZW50LnNwbGl0X3ZhbHVlX251bVxyXG4gICAgICBpZiAobmV3RWxlbWVudC5zcGxpdF92YWx1ZV90eXBlKSBmaWVsZC5zcGxpdF92YWx1ZV90eXBlPW5ld0VsZW1lbnQuc3BsaXRfdmFsdWVfdHlwZVxyXG4gICAgICAvLyBzZXQgZGVmYXVsdCB2YWx1ZXNcclxuICAgICAgZm9yKGxldCBuYW1lIGluIG5ld0VsZW1lbnQucGFyYW1ldGVycykge1xyXG4gICAgICAgIGxldCBwPW5ld0VsZW1lbnQucGFyYW1ldGVyc1tuYW1lXVxyXG4gICAgICAgIGlmIChwLm5hbWUhPT1cIm5hbWVcIiAmJiBwLm5hbWUhPT1cImxhYmVsXCIgJiYgcC5uYW1lIT1cImRlZmF1bHRcIikge1xyXG4gICAgICAgICAgZmllbGRbbmFtZV09cFtcImRlZmF1bHRcIl1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgbmV3RWxlbWVudD1maWVsZFxyXG4gICAgfVxyXG4gICAgZm9ybUVsZW1lbnRzLnB1c2gobmV3RWxlbWVudClcclxuICAgIGVuc3VyZVVuaXF1ZU5hbWVzKClcclxuICAgIGZvcm1FbGVtZW50cz1mb3JtRWxlbWVudHNcclxuICAgIHNob3dQcm9wZXJ0aWVzSWR4PWZvcm1FbGVtZW50cy5sZW5ndGgtMVxyXG4gICAgc2V0RGVmYXVsdFZhbHVlcygpICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlRHJhZ1N0YXJ0KGV2ZW50LCBpbmRleCkge1xyXG4gICAgaWYgKCFhZHZhbmNlZE9wdGlvbnMpIHJldHVyblxyXG4gICAgZHJhZ1N0YXJ0SW5kZXggPSBpbmRleFxyXG4gIH1cclxuICAvKipcclxuICAgKiBkcmFnIGFuZCBkcm9wIHRvIGNoYW5nZSBvcmRlciBpbiBsaXN0XHJcbiAgICogQHBhcmFtIGV2ZW50XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIoZXZlbnQpIHtcclxuICAgIGlmICghYWR2YW5jZWRPcHRpb25zKSByZXR1cm5cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCkgLy8gTmVjZXNzYXJ5IHRvIGFsbG93IGRyb3BwaW5nXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVEcm9wKGV2ZW50LCBkcm9wSW5kZXgpIHtcclxuICAgIGlmICghYWR2YW5jZWRPcHRpb25zKSByZXR1cm5cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgIGlmIChkcmFnU3RhcnRJbmRleCA9PT0gZHJvcEluZGV4KSByZXR1cm5cclxuICAgIFxyXG4gICAgY29uc3QgZHJhZ2dlZEl0ZW0gPSBmb3JtRWxlbWVudHNbZHJhZ1N0YXJ0SW5kZXhdO1xyXG4gICAgY29uc3QgcmVtYWluaW5nSXRlbXMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKChfLCBpbmRleCkgPT4gaW5kZXggIT09IGRyYWdTdGFydEluZGV4KVxyXG4gICAgY29uc3QgcmVvcmRlcmVkSXRlbXMgPSBbXHJcbiAgICAgICAgLi4ucmVtYWluaW5nSXRlbXMuc2xpY2UoMCwgZHJvcEluZGV4KSxcclxuICAgICAgICBkcmFnZ2VkSXRlbSxcclxuICAgICAgICAuLi5yZW1haW5pbmdJdGVtcy5zbGljZShkcm9wSW5kZXgpXHJcbiAgICBdXHJcbiAgICAvLyBSZWFzc2lnbiB0aGUgcmVvcmRlcmVkIGl0ZW1zIGJhY2sgdG8gZm9ybUVsZW1lbnRzXHJcbiAgICBmb3JtRWxlbWVudHMgPSByZW9yZGVyZWRJdGVtc1xyXG4gICAgZm9ybUVsZW1lbnRzPWZvcm1FbGVtZW50c1xyXG4gICAgLy8gUmVzZXQgZHJhZ2dlZCBpbmRleFxyXG4gICAgZHJhZ1N0YXJ0SW5kZXggPSAtMVxyXG4gICAgJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XS5lbGVtZW50cz1mb3JtRWxlbWVudHNcclxufVxyXG4vKipcclxuICogdXBkYXRlcyBlbGVtZW50cyBkYXRhIChlLmcuIG5hbWUsIGxhYmVsLC4uLilcclxuICogQHBhcmFtIGluZGV4XHJcbiAqIEBwYXJhbSBlbGVtZW50XHJcbiAqL1xyXG4gIGZ1bmN0aW9uIHVwZGF0ZUVsZW1lbnQoaW5kZXgsZWxlbWVudCkge1xyXG4gICAgZm9ybUVsZW1lbnRzW2luZGV4XT1lbGVtZW50XHJcbiAgICBlbnN1cmVVbmlxdWVOYW1lcygpXHJcbiAgICBzZXREZWZhdWx0VmFsdWVzKClcclxuICAgICRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV0uZWxlbWVudHM9Zm9ybUVsZW1lbnRzXHJcbiAgICBsZXQgaGVscGVyPW5ldyBtYXBwaW5nc0hlbHBlcigpXHJcbiAgICBoZWxwZXIuY2xlYW5VcE1hcHBpbmdzKCRtZXRhZGF0YSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsb25lRWxlbWVudChpbmRleCxlbGVtZW50KSB7XHJcbiAgICBsZXQgY2xvbmVFbGVtZW50PUpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZWxlbWVudCkpXHJcbiAgICBmb3JtRWxlbWVudHMucHVzaChjbG9uZUVsZW1lbnQpXHJcbiAgICBlbnN1cmVVbmlxdWVOYW1lcygpXHJcbiAgICBmb3JtRWxlbWVudHM9Zm9ybUVsZW1lbnRzXHJcbiAgICBzaG93UHJvcGVydGllc0lkeD1mb3JtRWxlbWVudHMubGVuZ3RoLTFcclxuICAgIHNldERlZmF1bHRWYWx1ZXMoKSAgICBcclxuICB9XHJcbiAgLyoqXHJcbiAgICogcmVtb3ZlIG9uZSBlbGVtZW50IGZyb20gZm9ybVxyXG4gICAqIEBwYXJhbSBpbmRleFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoaW5kZXgpIHtcclxuLy8gICAgc2VsZWN0V29ya2Zsb3dUeXBlPWZhbHNlXHJcbiAgICBmb3JtRWxlbWVudHMuc3BsaWNlKHNob3dQcm9wZXJ0aWVzSWR4LDEpO1xyXG4gICAgZm9ybUVsZW1lbnRzPWZvcm1FbGVtZW50cztcclxuICAgIHNob3dQcm9wZXJ0aWVzSWR4PS0xIFxyXG4gICAgJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XS5lbGVtZW50cz1mb3JtRWxlbWVudHMgICAgXHJcbiAgICBsZXQgaGVscGVyPW5ldyBtYXBwaW5nc0hlbHBlcigpICAgIFxyXG4gICAgaGVscGVyLmNsZWFuVXBNYXBwaW5ncygkbWV0YWRhdGEpXHJcbiAgfVxyXG5cclxuICBsZXQgYWR2YW5jZWRPcHRpb25zPXRydWVcclxuICAvKipcclxuICAgKiBoaWRlL3Nob3cgcGFydHMgb2YgdGhlIGZvcm1cclxuICAgKiBAcGFyYW0gZWxlbWVudFxyXG4gICAqIEBwYXJhbSBpbmRleFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNoZWNrQWR2YW5jZWRPcHRpb25zKGVsZW1lbnQsaW5kZXgpIHtcclxuICAgIGlmIChhZHZhbmNlZE9wdGlvbnMpIHJldHVybiBcImJsb2NrXCJcclxuICAgIGlmIChlbGVtZW50LnR5cGU9PT1cImFkdmFuY2VkX29wdGlvbnNcIikgcmV0dXJuIFwiYmxvY2tcIlxyXG4gICAgbGV0IGFkdmFuY2VkT3B0aW9uc0luZGV4PS0xXHJcbiAgICBmb3IobGV0IGk9MDtpPGZvcm1FbGVtZW50cy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgIGxldCBlPWZvcm1FbGVtZW50c1tpXVxyXG4gICAgICBpZiAgKGUudHlwZT09PVwiYWR2YW5jZWRfb3B0aW9uc1wiKSBhZHZhbmNlZE9wdGlvbnNJbmRleD1pXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFkdmFuY2VkT3B0aW9uc0luZGV4PDApIHsgLy8gZWxlbWVudCBkb2VzIG5vdCBleGlzdHMgYW55bW9yZVxyXG4gICAgICBhZHZhbmNlZE9wdGlvbnM9dHJ1ZVxyXG4gICAgICByZXR1cm4gXCJibG9ja1wiXHJcbiAgICB9XHJcbiAgICBpZiAoaW5kZXggPGFkdmFuY2VkT3B0aW9uc0luZGV4KSByZXR1cm4gXCJibG9ja1wiIC8vIGJlZm9yZSBhZHZhbmNlZCBvcHRpb25zXHJcbiAgICByZXR1cm4gXCJub25lXCJcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBleGVjdXRlUnVsZXMoZWxlbWVudCx2YWx1ZSkge1xyXG4gICAgLy8gZmlyc3Qgc2V0IHRoZSBuZXcgdmFsdWVcclxuICAgIGRhdGFbZWxlbWVudC5uYW1lXT12YWx1ZVxyXG4gICAgZGF0YS5jb250cm9sbmV0PVtdXHJcbiAgICBkYXRhLmNvbnRyb2xuZXRbMF09e1widHlwZVwiOlwicG9zZVwifVxyXG4gICAgLy8gbm93IGV4ZWN1dGUgcnVsZXNcclxuICAgIGxldCByZT1uZXcgcnVsZXNFeGVjdXRpb24oKSAgICBcclxuICAgIGxldCByZXM9cmUuZXhlY3V0ZShkYXRhLGZvcm1FbGVtZW50cywkbWV0YWRhdGEucnVsZXMse1wiY29udHJvbG5ldFwiOjB9KVxyXG4gICAgaWYgKCFyZXMpIHJldHVyblxyXG4gICAgZGF0YT1yZXMuZGF0YVxyXG4gICAgaWYgKHJlcy5oaWRkZW5GaWVsZHMubGVuZ3RoIHx8IHJlcy5zaG93RmllbGRzLmxlbmd0aCkgZm9ybUVsZW1lbnRzPWZvcm1FbGVtZW50c1xyXG4gIH1cclxuICBmdW5jdGlvbiBzZXREZWZhdWx0VmFsdWVzKCkge1xyXG4gICAgaWYgKCFmb3JtRWxlbWVudHMpIHJldHVyblxyXG4gICAgZm9yKGxldCBpPTA7aTxmb3JtRWxlbWVudHMubGVuZ3RoO2krKykge1xyXG4gICAgICBsZXQgZmllbGQ9Zm9ybUVsZW1lbnRzW2ldXHJcbiAgICAgIGlmICghZGF0YVtmaWVsZC5uYW1lXSkgZGF0YVtmaWVsZC5uYW1lXT1maWVsZC5kZWZhdWx0XHJcbiAgICB9XHJcbiAgfVxyXG5cclxubGV0IHNlbGVjdFdvcmtmbG93VHlwZT1mYWxzZVxyXG4gZnVuY3Rpb24gcXVpY2tzdGFydCh0eXBlKSB7XHJcbiAgbGV0IHdvcmtmbG93PXdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplKClcclxuICBsZXQgaGVscGVyPW5ldyBtYXBwaW5nc0hlbHBlclxyXG4gIC8vIDEuIHNldCBkZWZhdWx0IGZvcm1cclxuICBpZiAodHlwZT09PVwiVHh0MkltYWdlXCIgfHwgdHlwZT09PVwiSW5wYWludGluZ1wiKSB7XHJcbiAgICAkbWV0YWRhdGEuZm9ybXM9Zm9ybVRlbXBsYXRlX1R4dDJJbWFnZVxyXG4gICAgZm9ybUVsZW1lbnRzPSRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzXHJcbiAgICBzZXREZWZhdWx0VmFsdWVzKClcclxuICAgIGlmICgoJG1ldGFkYXRhLnRhZ3MgfHwgISRtZXRhZGF0YS50YWdzLmxlbmd0aCkgJiYgdHlwZT09PVwiVHh0MkltYWdlXCIpIHtcclxuICAgICAgJG1ldGFkYXRhLnRhZ3M9W1wiVHh0MkltYWdlXCJdXHJcbiAgICB9XHJcbiAgICBpZiAoKCRtZXRhZGF0YS50YWdzIHx8ICEkbWV0YWRhdGEudGFncy5sZW5ndGgpICYmIHR5cGU9PT1cIklucGFpbnRpbmdcIikge1xyXG4gICAgICAkbWV0YWRhdGEudGFncz1bXCJUeHQySW1hZ2VcIixcIklucGFpbnRpbmdcIl1cclxuICAgIH0gICAgXHJcbiAgfSBcclxuICBpZiAodHlwZT09PVwiTGF5ZXJNZW51XCIpIHtcclxuICAgICRtZXRhZGF0YS5mb3Jtcz1mb3JtVGVtcGxhdGVfTGF5ZXJNZW51XHJcbiAgICBmb3JtRWxlbWVudHM9JG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQuZWxlbWVudHNcclxuICAgIGlmICghJG1ldGFkYXRhLnRhZ3MgfHwgISRtZXRhZGF0YS50YWdzLmxlbmd0aCkgJG1ldGFkYXRhLnRhZ3M9W1wiTGF5ZXJNZW51XCJdXHJcbiAgICBzZXREZWZhdWx0VmFsdWVzKClcclxuICB9XHJcblxyXG4gIC8vIDIuIHNldCBkZWZhdWx0IG1hcHBpbmdzOiBvdXRwdXQgaW1hZ2VcclxuICBsZXQgbm9kZT1oZWxwZXIuZ2V0Tm9kZUJ5VHlwZSh3b3JrZmxvdyxcIlNhdmVJbWFnZVwiKVxyXG4gIGlmIChub2RlKSB7ICAgXHJcbiAgICBoZWxwZXIuYWRkTWFwcGluZygkbWV0YWRhdGEsbm9kZS5pZCxcInJlc3VsdEltYWdlXCIsXCJmaWxlbmFtZV9wcmVmaXhcIilcclxuICB9XHJcbiAgLy8gMy4gaW5wdXQgaW1hZ2UgbWFwcGluZ3NcclxuICBpZiAodHlwZT09PVwiTGF5ZXJNZW51XCIpIHtcclxuICAgIGxldCBub2RlPWhlbHBlci5nZXROb2RlQnlUeXBlKHdvcmtmbG93LFwiTG9hZEltYWdlXCIpXHJcbiAgICBpZiAobm9kZSkgeyAgIFxyXG4gICAgICBoZWxwZXIuYWRkTWFwcGluZygkbWV0YWRhdGEsbm9kZS5pZCxcImN1cnJlbnRMYXllclwiLFwiaW1hZ2VcIilcclxuICAgIH1cclxuICB9XHJcbiAgLy8gMy4gaW5wdXQgaW1hZ2UgbWFwcGluZ3NcclxuICBpZiAodHlwZT09PVwiVHh0MkltYWdlXCIpIHtcclxuICAgIGxldCBub2RlPWhlbHBlci5nZXROb2RlQnlUeXBlKHdvcmtmbG93LFwiTG9hZEltYWdlXCIpXHJcbiAgICBpZiAobm9kZSkgeyAgIFxyXG4gICAgICBoZWxwZXIuYWRkTWFwcGluZygkbWV0YWRhdGEsbm9kZS5pZCxcIm1lcmdlZEltYWdlXCIsXCJpbWFnZVwiKVxyXG4gICAgfVxyXG4gIH0gIFxyXG4gIHNlbGVjdFdvcmtmbG93VHlwZT1mYWxzZVxyXG4gICBkaXNwYXRjaChcInJlZnJlc2hUYWdzXCIsJG1ldGFkYXRhLnRhZ3MpXHJcbiB9XHJcbiBsZXQgZmllbGRTZWxlY3RvclxyXG5cclxuPC9zY3JpcHQ+XHJcblxyXG48RmllbGRTZWxlY3RvciB7Y3VzdG9tX3VpX2NvbXBvbmVudHN9IGJpbmQ6dGhpcz17ZmllbGRTZWxlY3Rvcn0gb246c2VsZWN0PXsoZSk9PnsgYWRkRWxlbWVudChlKX19PjwvRmllbGRTZWxlY3Rvcj5cclxuXHJcblxyXG48ZGl2IGNsYXNzPVwiZm9ybUJ1aWxkZXJcIj5cclxuPGgxPkVkaXQgZm9ybTwvaDE+XHJcbjxkaXYgY2xhc3M9XCJmb3JtXCI+XHJcbiAgeyNpZiAhZm9ybUVsZW1lbnRzLmxlbmd0aH1cclxuICAgIHsjaWYgIXNlbGVjdFdvcmtmbG93VHlwZX1cclxuICAgICAgPGJ1dHRvbiBvbjpjbGljaz17KCk9PntzZWxlY3RXb3JrZmxvd1R5cGU9dHJ1ZX19PlF1aWNrc3RhcnQ8L2J1dHRvbj5cclxuICAgIHs6ZWxzZX1cclxuICAgICAgUXVpY2tzdGFydCAtIFNlbGVjdCB0eXBlOjxicj48YnI+XHJcbiAgICAgIDxidXR0b24gb246Y2xpY2s9eygpPT57cXVpY2tzdGFydChcIlR4dDJJbWFnZVwiKX19PlR4dDJJbWFnZTwvYnV0dG9uPlxyXG4gICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKT0+e3F1aWNrc3RhcnQoXCJJbnBhaW50aW5nXCIpfX0+SW5wYWludGluZzwvYnV0dG9uPlxyXG4gICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKT0+e3F1aWNrc3RhcnQoXCJMYXllck1lbnVcIil9fT5MYXllck1lbnU8L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcblxyXG5cclxuICB7L2lmfVxyXG4gIHsjZWFjaCBmb3JtRWxlbWVudHMgYXMgZWxlbWVudCwgaW5kZXggKGVsZW1lbnQubmFtZSl9XHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzPVwiZHJhZ2dhYmxlXCJcclxuICAgICAgZHJhZ2dhYmxlPVwidHJ1ZVwiXHJcbiAgICAgIHN0eWxlPVwiZGlzcGxheTp7Y2hlY2tBZHZhbmNlZE9wdGlvbnMoZWxlbWVudCxpbmRleCl9XCJcclxuICAgICAgb246ZHJhZ3N0YXJ0PXsoKSA9PiBoYW5kbGVEcmFnU3RhcnQoZXZlbnQsIGluZGV4KX1cclxuICAgICAgb246ZHJhZ292ZXI9e2hhbmRsZURyYWdPdmVyfVxyXG4gICAgICBvbjpkcm9wPXsoKSA9PiBoYW5kbGVEcm9wKGV2ZW50LCBpbmRleCl9PlxyXG4gICAgICA8Rm9ybUVsZW1lbnQge2VsZW1lbnR9IGJpbmQ6YWR2YW5jZWRPcHRpb25zPXthZHZhbmNlZE9wdGlvbnN9XHJcbiAgICAgICAgb246cmVkcmF3QWxsPXsoZSkgPT4ge2Zvcm1FbGVtZW50cz1mb3JtRWxlbWVudHN9fVxyXG5cclxuICAgICAgICBvbjpvcGVuUHJvcGVydGllcz17KCkgPT4ge3Nob3dQcm9wZXJ0aWVzSWR4PWluZGV4IH19IFxyXG4gICAgICAgIG9uOmNsb3NlUHJvcGVydGllcz17KCkgPT4ge3Nob3dQcm9wZXJ0aWVzSWR4PS0xIH19XHJcbiAgICAgICAgb246dXBkYXRlPXsoZSkgPT4geyB1cGRhdGVFbGVtZW50KGluZGV4LGUuZGV0YWlsKSAgfX1cclxuICAgICAgICBvbjpjbG9uZT17KGUpID0+IHsgY2xvbmVFbGVtZW50KGluZGV4LGUuZGV0YWlsKSAgfX1cclxuICAgICAgICBvbjpkZWxldGU9eyhlKSA9PiB7IHJlbW92ZUVsZW1lbnQoaW5kZXgpIH19XHJcbiAgICAgICAgdmFsdWU9e2RhdGFbZWxlbWVudC5uYW1lXX1cclxuICAgICAgICBvbjpjaGFuZ2U9e2UgPT4geyBleGVjdXRlUnVsZXMoZWxlbWVudCxlLmRldGFpbC52YWx1ZSk7IGZvcm1FbGVtZW50cz1mb3JtRWxlbWVudHM7IH19XHJcbiAgICAgICAgc2hvd1Byb3BlcnRpZXM9e3Nob3dQcm9wZXJ0aWVzSWR4PT09aW5kZXh9XHJcbiAgICAgICAge25vX2VkaXR9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgey9lYWNofVxyXG48L2Rpdj5cclxuPGRpdj5cclxuIHsjaWYgIW5vX2VkaXR9XHJcbiAgPGJ1dHRvbiBvbjpjbGljaz17KGUpID0+IGZpZWxkU2VsZWN0b3Iub3BlbkRpYWxvZyhlLHBvc1gscG9zWSl9PisgQWRkIEVsZW1lbnQ8L2J1dHRvbj5cclxuey9pZn1cclxuPC9kaXY+XHJcbjwvZGl2PlxyXG48c3R5bGU+XHJcbiAgLmZvcm1CdWlsZGVyIHtcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB3aWR0aDogNDcwcHg7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICB9XHJcbiAgLmZvcm1CdWlsZGVyIGgxIHtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbiAgfVxyXG4gIC5kcmFnZ2FibGUge1xyXG4gICAgY3Vyc29yOiBncmFiO1xyXG4gIH1cclxuICAuZm9ybSB7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgIHdpZHRoOiA0NTBweDtcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250OiBcIlNlZ29lIFVJXCIsIFJvYm90bywgc3lzdGVtLXVpO1xyXG4gICAgZm9udC1zaXplOjE0cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gIH1cclxuICAuZm9ybUJ1aWxkZXIgLmFkZF9maWVsZF9zZWxlY3RfbGFiZWwge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIH1cclxuICAuZm9ybUJ1aWxkZXIgLmFkZF9maWVsZF9zZWxlY3Qge1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgcGFkZGluZzogNXB4OyAgIFxyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB9XHJcbiAgICAuZm9ybUJ1aWxkZXIgYnV0dG9uIHtcclxuICAgICAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgbWluLXdpZHRoOiA3MHB4O1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9XHJcbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTJURSwwQ0FBYSxDQUNYLE9BQU8sQ0FBRSxJQUFJLENBQ2IsS0FBSyxDQUFFLEtBQUssQ0FDWixLQUFLLENBQUUsS0FBSyxDQUNaLE9BQU8sQ0FBRSxLQUNYLENBQ0EsMkJBQVksQ0FBQyxpQkFBRyxDQUNkLFNBQVMsQ0FBRSxJQUFJLENBQ2YsYUFBYSxDQUFFLElBQ2pCLENBQ0Esd0NBQVcsQ0FDVCxNQUFNLENBQUUsSUFDVixDQUNBLG1DQUFNLENBQ0osYUFBYSxDQUFFLEdBQUcsQ0FDbEIsZ0JBQWdCLENBQUUsS0FBSyxDQUN2QixLQUFLLENBQUUsS0FBSyxDQUNaLE9BQU8sQ0FBRSxJQUFJLENBQ2IsS0FBSyxDQUFFLEtBQUssQ0FDWixJQUFJLENBQUUsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUNuQyxVQUFVLElBQUksQ0FDZCxhQUFhLENBQUUsSUFDakIsQ0FXRSwyQkFBWSxDQUFDLHFCQUFPLENBQ2hCLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLFNBQVMsQ0FBRSxJQUFJLENBQ2YsU0FBUyxDQUFFLElBQUksQ0FDZixLQUFLLENBQUUsS0FBSyxDQUNaLGdCQUFnQixDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ3BDLFlBQVksQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNoQyxhQUFhLENBQUUsR0FBRyxDQUNsQixNQUFNLENBQUUsT0FBTyxDQUNmLFlBQVksQ0FBRSxJQUNsQiJ9 */");
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[45] = list[i];
    	child_ctx[47] = i;
    	return child_ctx;
    }

    // (273:2) {#if !formElements.length}
    function create_if_block_1$4(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*selectWorkflowType*/ ctx[8]) return create_if_block_2$4;
    		return create_else_block$3;
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
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(273:2) {#if !formElements.length}",
    		ctx
    	});

    	return block;
    }

    // (276:4) {:else}
    function create_else_block$3(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Quickstart - Select type:");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "Txt2Image";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Inpainting";
    			t5 = space();
    			button2 = element("button");
    			button2.textContent = "LayerMenu";
    			add_location(br0, file$5, 276, 31, 8954);
    			add_location(br1, file$5, 276, 35, 8958);
    			attr_dev(button0, "class", "svelte-1yl6ahv");
    			add_location(button0, file$5, 277, 6, 8970);
    			attr_dev(button1, "class", "svelte-1yl6ahv");
    			add_location(button1, file$5, 278, 6, 9045);
    			attr_dev(button2, "class", "svelte-1yl6ahv");
    			add_location(button2, file$5, 279, 6, 9122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button2, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[25], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[26], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_3*/ ctx[27], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(276:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (274:4) {#if !selectWorkflowType}
    function create_if_block_2$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Quickstart";
    			attr_dev(button, "class", "svelte-1yl6ahv");
    			add_location(button, file$5, 274, 6, 8840);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[24], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(274:4) {#if !selectWorkflowType}",
    		ctx
    	});

    	return block;
    }

    // (285:2) {#each formElements as element, index (element.name)}
    function create_each_block$5(key_1, ctx) {
    	let div;
    	let formelement;
    	let updating_advancedOptions;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	function formelement_advancedOptions_binding(value) {
    		/*formelement_advancedOptions_binding*/ ctx[28](value);
    	}

    	function openProperties_handler() {
    		return /*openProperties_handler*/ ctx[30](/*index*/ ctx[47]);
    	}

    	function update_handler(...args) {
    		return /*update_handler*/ ctx[32](/*index*/ ctx[47], ...args);
    	}

    	function clone_handler(...args) {
    		return /*clone_handler*/ ctx[33](/*index*/ ctx[47], ...args);
    	}

    	function delete_handler(...args) {
    		return /*delete_handler*/ ctx[34](/*index*/ ctx[47], ...args);
    	}

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[35](/*element*/ ctx[45], ...args);
    	}

    	let formelement_props = {
    		element: /*element*/ ctx[45],
    		value: /*data*/ ctx[0][/*element*/ ctx[45].name],
    		showProperties: /*showPropertiesIdx*/ ctx[6] === /*index*/ ctx[47],
    		no_edit: /*no_edit*/ ctx[4]
    	};

    	if (/*advancedOptions*/ ctx[7] !== void 0) {
    		formelement_props.advancedOptions = /*advancedOptions*/ ctx[7];
    	}

    	formelement = new FormElement({ props: formelement_props, $$inline: true });
    	binding_callbacks.push(() => bind(formelement, 'advancedOptions', formelement_advancedOptions_binding));
    	formelement.$on("redrawAll", /*redrawAll_handler*/ ctx[29]);
    	formelement.$on("openProperties", openProperties_handler);
    	formelement.$on("closeProperties", /*closeProperties_handler*/ ctx[31]);
    	formelement.$on("update", update_handler);
    	formelement.$on("clone", clone_handler);
    	formelement.$on("delete", delete_handler);
    	formelement.$on("change", change_handler);

    	function dragstart_handler() {
    		return /*dragstart_handler*/ ctx[36](/*index*/ ctx[47]);
    	}

    	function drop_handler() {
    		return /*drop_handler*/ ctx[37](/*index*/ ctx[47]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(formelement.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "draggable svelte-1yl6ahv");
    			attr_dev(div, "draggable", "true");
    			set_style(div, "display", /*checkAdvancedOptions*/ ctx[17](/*element*/ ctx[45], /*index*/ ctx[47]));
    			add_location(div, file$5, 285, 4, 9276);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(formelement, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "dragstart", dragstart_handler, false, false, false, false),
    					listen_dev(div, "dragover", /*handleDragOver*/ ctx[12], false, false, false, false),
    					listen_dev(div, "drop", drop_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formelement_changes = {};
    			if (dirty[0] & /*formElements*/ 32) formelement_changes.element = /*element*/ ctx[45];
    			if (dirty[0] & /*data, formElements*/ 33) formelement_changes.value = /*data*/ ctx[0][/*element*/ ctx[45].name];
    			if (dirty[0] & /*showPropertiesIdx, formElements*/ 96) formelement_changes.showProperties = /*showPropertiesIdx*/ ctx[6] === /*index*/ ctx[47];
    			if (dirty[0] & /*no_edit*/ 16) formelement_changes.no_edit = /*no_edit*/ ctx[4];

    			if (!updating_advancedOptions && dirty[0] & /*advancedOptions*/ 128) {
    				updating_advancedOptions = true;
    				formelement_changes.advancedOptions = /*advancedOptions*/ ctx[7];
    				add_flush_callback(() => updating_advancedOptions = false);
    			}

    			formelement.$set(formelement_changes);

    			if (!current || dirty[0] & /*formElements*/ 32) {
    				set_style(div, "display", /*checkAdvancedOptions*/ ctx[17](/*element*/ ctx[45], /*index*/ ctx[47]));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formelement.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formelement.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(formelement);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(285:2) {#each formElements as element, index (element.name)}",
    		ctx
    	});

    	return block;
    }

    // (310:1) {#if !no_edit}
    function create_if_block$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+ Add Element";
    			attr_dev(button, "class", "svelte-1yl6ahv");
    			add_location(button, file$5, 310, 2, 10238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[38], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(310:1) {#if !no_edit}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let fieldselector;
    	let t0;
    	let div2;
    	let h1;
    	let t2;
    	let div0;
    	let t3;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t4;
    	let div1;
    	let current;

    	let fieldselector_props = {
    		custom_ui_components: /*custom_ui_components*/ ctx[3]
    	};

    	fieldselector = new FieldSelector({
    			props: fieldselector_props,
    			$$inline: true
    		});

    	/*fieldselector_binding*/ ctx[22](fieldselector);
    	fieldselector.$on("select", /*select_handler*/ ctx[23]);
    	let if_block0 = !/*formElements*/ ctx[5].length && create_if_block_1$4(ctx);
    	let each_value = /*formElements*/ ctx[5];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*element*/ ctx[45].name;
    	validate_each_keys(ctx, each_value, get_each_context$5, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$5(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
    	}

    	let if_block1 = !/*no_edit*/ ctx[4] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			create_component(fieldselector.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Edit form";
    			t2 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(h1, "class", "svelte-1yl6ahv");
    			add_location(h1, file$5, 270, 0, 8733);
    			attr_dev(div0, "class", "form svelte-1yl6ahv");
    			add_location(div0, file$5, 271, 0, 8753);
    			add_location(div1, file$5, 308, 0, 10212);
    			attr_dev(div2, "class", "formBuilder svelte-1yl6ahv");
    			add_location(div2, file$5, 269, 0, 8706);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldselector, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t2);
    			append_dev(div2, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldselector_changes = {};
    			if (dirty[0] & /*custom_ui_components*/ 8) fieldselector_changes.custom_ui_components = /*custom_ui_components*/ ctx[3];
    			fieldselector.$set(fieldselector_changes);

    			if (!/*formElements*/ ctx[5].length) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					if_block0.m(div0, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*checkAdvancedOptions, formElements, handleDragStart, handleDragOver, handleDrop, data, showPropertiesIdx, no_edit, advancedOptions, updateElement, cloneElement, removeElement, executeRules*/ 522481) {
    				each_value = /*formElements*/ ctx[5];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$5, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$5, null, get_each_context$5);
    				check_outros();
    			}

    			if (!/*no_edit*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldselector.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldselector.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*fieldselector_binding*/ ctx[22](null);
    			destroy_component(fieldselector, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (if_block1) if_block1.d();
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
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(40, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormBuilder', slots, []);
    	const dispatch = createEventDispatcher();
    	if (!$metadata.forms) set_store_value(metadata, $metadata.forms = {}, $metadata);
    	let { form_key = 'default' } = $$props; // support for multiple forms (e.g. wizards) in the future
    	let { data = {} } = $$props; // the form data
    	let { refresh } = $$props;
    	let { posX, posY } = $$props; // position of the parent dialog
    	let { custom_ui_components } = $$props;
    	let { no_edit = false } = $$props;
    	if (!$metadata.forms[form_key]) set_store_value(metadata, $metadata.forms[form_key] = { elements: [] }, $metadata);
    	if (!$metadata.forms[form_key].elements) set_store_value(metadata, $metadata.forms[form_key].elements = [], $metadata);
    	let formElements = $metadata.forms[form_key].elements;
    	ensureUniqueNames();
    	setDefaultValues();
    	let dragStartIndex = -1;
    	let showPropertiesIdx = -1;
    	let selectedType;

    	function ensureUniqueNames() {
    		const nameMap = {}; // Object to keep track of names and their occurrences

    		formElements.forEach(element => {
    			let name = element.name;

    			// Check if the name already exists in the nameMap
    			if (nameMap[name]) {
    				// If the name exists, increment the count and append it to the name
    				let count = nameMap[name];

    				let newName = `${name}_${count}`;

    				while (nameMap[newName]) {
    					// Ensure the new name is also unique
    					count++;

    					newName = `${name}_${count}`;
    				}

    				element.name = newName;
    				nameMap[name]++;
    				nameMap[newName] = 1; // Initialize this new name in the nameMap
    			} else {
    				// If the name doesn't exist, add it to the nameMap
    				nameMap[name] = 1;
    			}
    		});
    	}

    	onMount(() => {
    		if (!data || !formElements) return;
    		let re = new rulesExecution();
    		let res = re.execute(data, formElements, $metadata.rules, { "controlnet": 0 });
    		if (!res) return;
    		$$invalidate(0, data = res.data);
    		if (res.hiddenFields.length || res.showFields.length) (($$invalidate(5, formElements), $$invalidate(21, refresh)), $$invalidate(0, data));
    	});

    	function addElement(e) {
    		fieldSelector.hideDialog();
    		let newElement = e.detail;
    		if (!newElement) return;

    		if (newElement.custom) {
    			// custom element
    			let field = {
    				type: "custom",
    				tag: newElement.tag,
    				name: newElement.parameters.name.default,
    				label: newElement.parameters.label.default,
    				default: newElement.parameters.default.default,
    				parameters: newElement.parameters
    			};

    			if (newElement.split_value_num) field.split_value_num = newElement.split_value_num;
    			if (newElement.split_value_type) field.split_value_type = newElement.split_value_type;

    			// set default values
    			for (let name in newElement.parameters) {
    				let p = newElement.parameters[name];

    				if (p.name !== "name" && p.name !== "label" && p.name != "default") {
    					field[name] = p["default"];
    				}
    			}

    			newElement = field;
    		}

    		formElements.push(newElement);
    		ensureUniqueNames();
    		(($$invalidate(5, formElements), $$invalidate(21, refresh)), $$invalidate(0, data));
    		$$invalidate(6, showPropertiesIdx = formElements.length - 1);
    		setDefaultValues();
    	}

    	function handleDragStart(event, index) {
    		if (!advancedOptions) return;
    		dragStartIndex = index;
    	}

    	/**
     * drag and drop to change order in list
     * @param event
     */
    	function handleDragOver(event) {
    		if (!advancedOptions) return;
    		event.preventDefault(); // Necessary to allow dropping
    	}

    	function handleDrop(event, dropIndex) {
    		if (!advancedOptions) return;
    		event.preventDefault();
    		if (dragStartIndex === dropIndex) return;
    		const draggedItem = formElements[dragStartIndex];
    		const remainingItems = formElements.filter((_, index) => index !== dragStartIndex);

    		const reorderedItems = [
    			...remainingItems.slice(0, dropIndex),
    			draggedItem,
    			...remainingItems.slice(dropIndex)
    		];

    		// Reassign the reordered items back to formElements
    		$$invalidate(5, formElements = reorderedItems);

    		(($$invalidate(5, formElements), $$invalidate(21, refresh)), $$invalidate(0, data));

    		// Reset dragged index
    		dragStartIndex = -1;

    		set_store_value(metadata, $metadata.forms[form_key].elements = formElements, $metadata);
    	}

    	/**
     * updates elements data (e.g. name, label,...)
     * @param index
     * @param element
     */
    	function updateElement(index, element) {
    		$$invalidate(5, formElements[index] = element, formElements);
    		ensureUniqueNames();
    		setDefaultValues();
    		set_store_value(metadata, $metadata.forms[form_key].elements = formElements, $metadata);
    		let helper = new mappingsHelper();
    		helper.cleanUpMappings($metadata);
    	}

    	function cloneElement(index, element) {
    		let cloneElement = JSON.parse(JSON.stringify(element));
    		formElements.push(cloneElement);
    		ensureUniqueNames();
    		(($$invalidate(5, formElements), $$invalidate(21, refresh)), $$invalidate(0, data));
    		$$invalidate(6, showPropertiesIdx = formElements.length - 1);
    		setDefaultValues();
    	}

    	/**
     * remove one element from form
     * @param index
     */
    	function removeElement(index) {
    		//    selectWorkflowType=false
    		formElements.splice(showPropertiesIdx, 1);

    		(($$invalidate(5, formElements), $$invalidate(21, refresh)), $$invalidate(0, data));
    		$$invalidate(6, showPropertiesIdx = -1);
    		set_store_value(metadata, $metadata.forms[form_key].elements = formElements, $metadata);
    		let helper = new mappingsHelper();
    		helper.cleanUpMappings($metadata);
    	}

    	let advancedOptions = true;

    	/**
     * hide/show parts of the form
     * @param element
     * @param index
     */
    	function checkAdvancedOptions(element, index) {
    		if (advancedOptions) return "block";
    		if (element.type === "advanced_options") return "block";
    		let advancedOptionsIndex = -1;

    		for (let i = 0; i < formElements.length; i++) {
    			let e = formElements[i];
    			if (e.type === "advanced_options") advancedOptionsIndex = i;
    		}

    		if (advancedOptionsIndex < 0) {
    			// element does not exists anymore
    			$$invalidate(7, advancedOptions = true);

    			return "block";
    		}

    		if (index < advancedOptionsIndex) return "block"; // before advanced options
    		return "none";
    	}

    	function executeRules(element, value) {
    		// first set the new value
    		$$invalidate(0, data[element.name] = value, data);

    		$$invalidate(0, data.controlnet = [], data);
    		$$invalidate(0, data.controlnet[0] = { "type": "pose" }, data);

    		// now execute rules
    		let re = new rulesExecution();

    		let res = re.execute(data, formElements, $metadata.rules, { "controlnet": 0 });
    		if (!res) return;
    		$$invalidate(0, data = res.data);
    		if (res.hiddenFields.length || res.showFields.length) (($$invalidate(5, formElements), $$invalidate(21, refresh)), $$invalidate(0, data));
    	}

    	function setDefaultValues() {
    		if (!formElements) return;

    		for (let i = 0; i < formElements.length; i++) {
    			let field = formElements[i];
    			if (!data[field.name]) $$invalidate(0, data[field.name] = field.default, data);
    		}
    	}

    	let selectWorkflowType = false;

    	function quickstart(type) {
    		let workflow = window.app.graph.serialize();
    		let helper = new mappingsHelper();

    		// 1. set default form
    		if (type === "Txt2Image" || type === "Inpainting") {
    			set_store_value(metadata, $metadata.forms = formTemplate_Txt2Image, $metadata);
    			$$invalidate(5, formElements = $metadata.forms.default.elements);
    			setDefaultValues();

    			if (($metadata.tags || !$metadata.tags.length) && type === "Txt2Image") {
    				set_store_value(metadata, $metadata.tags = ["Txt2Image"], $metadata);
    			}

    			if (($metadata.tags || !$metadata.tags.length) && type === "Inpainting") {
    				set_store_value(metadata, $metadata.tags = ["Txt2Image", "Inpainting"], $metadata);
    			}
    		}

    		if (type === "LayerMenu") {
    			set_store_value(metadata, $metadata.forms = formTemplate_LayerMenu, $metadata);
    			$$invalidate(5, formElements = $metadata.forms.default.elements);
    			if (!$metadata.tags || !$metadata.tags.length) set_store_value(metadata, $metadata.tags = ["LayerMenu"], $metadata);
    			setDefaultValues();
    		}

    		// 2. set default mappings: output image
    		let node = helper.getNodeByType(workflow, "SaveImage");

    		if (node) {
    			helper.addMapping($metadata, node.id, "resultImage", "filename_prefix");
    		}

    		// 3. input image mappings
    		if (type === "LayerMenu") {
    			let node = helper.getNodeByType(workflow, "LoadImage");

    			if (node) {
    				helper.addMapping($metadata, node.id, "currentLayer", "image");
    			}
    		}

    		// 3. input image mappings
    		if (type === "Txt2Image") {
    			let node = helper.getNodeByType(workflow, "LoadImage");

    			if (node) {
    				helper.addMapping($metadata, node.id, "mergedImage", "image");
    			}
    		}

    		$$invalidate(8, selectWorkflowType = false);
    		dispatch("refreshTags", $metadata.tags);
    	}

    	let fieldSelector;

    	$$self.$$.on_mount.push(function () {
    		if (refresh === undefined && !('refresh' in $$props || $$self.$$.bound[$$self.$$.props['refresh']])) {
    			console.warn("<FormBuilder> was created without expected prop 'refresh'");
    		}

    		if (posX === undefined && !('posX' in $$props || $$self.$$.bound[$$self.$$.props['posX']])) {
    			console.warn("<FormBuilder> was created without expected prop 'posX'");
    		}

    		if (posY === undefined && !('posY' in $$props || $$self.$$.bound[$$self.$$.props['posY']])) {
    			console.warn("<FormBuilder> was created without expected prop 'posY'");
    		}

    		if (custom_ui_components === undefined && !('custom_ui_components' in $$props || $$self.$$.bound[$$self.$$.props['custom_ui_components']])) {
    			console.warn("<FormBuilder> was created without expected prop 'custom_ui_components'");
    		}
    	});

    	const writable_props = [
    		'form_key',
    		'data',
    		'refresh',
    		'posX',
    		'posY',
    		'custom_ui_components',
    		'no_edit'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormBuilder> was created with unknown prop '${key}'`);
    	});

    	function fieldselector_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fieldSelector = $$value;
    			$$invalidate(9, fieldSelector);
    		});
    	}

    	const select_handler = e => {
    		addElement(e);
    	};

    	const click_handler = () => {
    		$$invalidate(8, selectWorkflowType = true);
    	};

    	const click_handler_1 = () => {
    		quickstart("Txt2Image");
    	};

    	const click_handler_2 = () => {
    		quickstart("Inpainting");
    	};

    	const click_handler_3 = () => {
    		quickstart("LayerMenu");
    	};

    	function formelement_advancedOptions_binding(value) {
    		advancedOptions = value;
    		$$invalidate(7, advancedOptions);
    	}

    	const redrawAll_handler = e => {
    		(($$invalidate(5, formElements), $$invalidate(21, refresh)), $$invalidate(0, data));
    	};

    	const openProperties_handler = index => {
    		$$invalidate(6, showPropertiesIdx = index);
    	};

    	const closeProperties_handler = () => {
    		$$invalidate(6, showPropertiesIdx = -1);
    	};

    	const update_handler = (index, e) => {
    		updateElement(index, e.detail);
    	};

    	const clone_handler = (index, e) => {
    		cloneElement(index, e.detail);
    	};

    	const delete_handler = (index, e) => {
    		removeElement();
    	};

    	const change_handler = (element, e) => {
    		executeRules(element, e.detail.value);
    		(($$invalidate(5, formElements), $$invalidate(21, refresh)), $$invalidate(0, data));
    	};

    	const dragstart_handler = index => handleDragStart(event, index);
    	const drop_handler = index => handleDrop(event, index);
    	const click_handler_4 = e => fieldSelector.openDialog(e, posX, posY);

    	$$self.$$set = $$props => {
    		if ('form_key' in $$props) $$invalidate(20, form_key = $$props.form_key);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('refresh' in $$props) $$invalidate(21, refresh = $$props.refresh);
    		if ('posX' in $$props) $$invalidate(1, posX = $$props.posX);
    		if ('posY' in $$props) $$invalidate(2, posY = $$props.posY);
    		if ('custom_ui_components' in $$props) $$invalidate(3, custom_ui_components = $$props.custom_ui_components);
    		if ('no_edit' in $$props) $$invalidate(4, no_edit = $$props.no_edit);
    	};

    	$$self.$capture_state = () => ({
    		FormElement,
    		metadata,
    		rulesExecution,
    		formTemplate_Txt2Image,
    		formTemplate_LayerMenu,
    		mappingsHelper,
    		FieldSelector,
    		createEventDispatcher,
    		onMount,
    		dispatch,
    		form_key,
    		data,
    		refresh,
    		posX,
    		posY,
    		custom_ui_components,
    		no_edit,
    		formElements,
    		dragStartIndex,
    		showPropertiesIdx,
    		selectedType,
    		ensureUniqueNames,
    		addElement,
    		handleDragStart,
    		handleDragOver,
    		handleDrop,
    		updateElement,
    		cloneElement,
    		removeElement,
    		advancedOptions,
    		checkAdvancedOptions,
    		executeRules,
    		setDefaultValues,
    		selectWorkflowType,
    		quickstart,
    		fieldSelector,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('form_key' in $$props) $$invalidate(20, form_key = $$props.form_key);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('refresh' in $$props) $$invalidate(21, refresh = $$props.refresh);
    		if ('posX' in $$props) $$invalidate(1, posX = $$props.posX);
    		if ('posY' in $$props) $$invalidate(2, posY = $$props.posY);
    		if ('custom_ui_components' in $$props) $$invalidate(3, custom_ui_components = $$props.custom_ui_components);
    		if ('no_edit' in $$props) $$invalidate(4, no_edit = $$props.no_edit);
    		if ('formElements' in $$props) $$invalidate(5, formElements = $$props.formElements);
    		if ('dragStartIndex' in $$props) dragStartIndex = $$props.dragStartIndex;
    		if ('showPropertiesIdx' in $$props) $$invalidate(6, showPropertiesIdx = $$props.showPropertiesIdx);
    		if ('selectedType' in $$props) selectedType = $$props.selectedType;
    		if ('advancedOptions' in $$props) $$invalidate(7, advancedOptions = $$props.advancedOptions);
    		if ('selectWorkflowType' in $$props) $$invalidate(8, selectWorkflowType = $$props.selectWorkflowType);
    		if ('fieldSelector' in $$props) $$invalidate(9, fieldSelector = $$props.fieldSelector);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*refresh, formElements, data*/ 2097185) {
    			{
    				if (refresh) {
    					for (let i = 0; i < formElements.length; i++) {
    						let element = formElements[i];
    						if (!data[element.name]) $$invalidate(0, data[element.name] = element.default, data);
    					}

    					(($$invalidate(5, formElements), $$invalidate(21, refresh)), $$invalidate(0, data));
    				}
    			}
    		}
    	};

    	return [
    		data,
    		posX,
    		posY,
    		custom_ui_components,
    		no_edit,
    		formElements,
    		showPropertiesIdx,
    		advancedOptions,
    		selectWorkflowType,
    		fieldSelector,
    		addElement,
    		handleDragStart,
    		handleDragOver,
    		handleDrop,
    		updateElement,
    		cloneElement,
    		removeElement,
    		checkAdvancedOptions,
    		executeRules,
    		quickstart,
    		form_key,
    		refresh,
    		fieldselector_binding,
    		select_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		formelement_advancedOptions_binding,
    		redrawAll_handler,
    		openProperties_handler,
    		closeProperties_handler,
    		update_handler,
    		clone_handler,
    		delete_handler,
    		change_handler,
    		dragstart_handler,
    		drop_handler,
    		click_handler_4
    	];
    }

    class FormBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$6,
    			create_fragment$6,
    			safe_not_equal,
    			{
    				form_key: 20,
    				data: 0,
    				refresh: 21,
    				posX: 1,
    				posY: 2,
    				custom_ui_components: 3,
    				no_edit: 4
    			},
    			add_css$6,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormBuilder",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get form_key() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form_key(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get refresh() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set refresh(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get posX() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set posX(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get posY() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set posY(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get custom_ui_components() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set custom_ui_components(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get no_edit() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set no_edit(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\EditModels.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1$1 } = globals;
    const file$4 = "src\\EditModels.svelte";

    function add_css$5(target) {
    	append_styles(target, "svelte-184ory", ".not-found.svelte-184ory.svelte-184ory{color:#ff6e6e}.modelEntry.svelte-184ory.svelte-184ory{list-style-type:none;position:relative}.modelEntry.svelte-184ory .deleteIcon.svelte-184ory{display:none;top:0px;right:10px;position:absolute}.modelEntry.svelte-184ory:hover .deleteIcon.svelte-184ory{display:block}.modelEntry.svelte-184ory:hover .inputURL.svelte-184ory{opacity:1.0;transition:opacity 0.5s}.input.svelte-184ory.svelte-184ory{background-color:black;color:white;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px;width:calc(100% - 30px)}h1.svelte-184ory.svelte-184ory{font-size:16px;margin-bottom:30px}.progressBarContainer.svelte-184ory.svelte-184ory{width:calc(100% - 30px);margin-top:13px;margin-bottom:13px;white-space:nowrap}.progress.svelte-184ory.svelte-184ory{height:10px;background-color:green;transition:0.1s;display:inline-block}.inputURL.svelte-184ory.svelte-184ory{background-color:transparent;margin-top:10px;margin-bottom:10px;opacity:0}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWRpdE1vZGVscy5zdmVsdGUiLCJzb3VyY2VzIjpbIkVkaXRNb2RlbHMuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICAvKlxyXG4gICAgICAgIG1vZGVsIGxpc3QgZWRpdG9yIGdpdmVuIGEgbGlzdCBvZiBhbGwgaW5zdGFsbGVkIG1vZGVscyBvbiBzZXJ2ZXJcclxuICAgICAgICBub3cgd2l0aCBtb2RlbCBkb3dubG9hZCBzdXBwb3J0XHJcbiAgICAqL1xyXG4gICAgaW1wb3J0IHtvbk1vdW50fSBmcm9tICdzdmVsdGUnICAgXHJcbiAgICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnICAgIFxyXG4gICAgaW1wb3J0IHsgbWV0YWRhdGF9IGZyb20gJy4vc3RvcmVzL21ldGFkYXRhJ1xyXG4gICAgaW1wb3J0IHsgbWFwcGluZ3NIZWxwZXIgfSBmcm9tICcuL21hcHBpbmdzSGVscGVyLmpzJ1xyXG5cclxuICAgIGltcG9ydCBJY29uIGZyb20gJy4vSWNvbi5zdmVsdGUnXHJcbiAgICBleHBvcnQgbGV0IG5vX2VkaXQ9ZmFsc2VcclxuICAgIGV4cG9ydCBsZXQgYXZhaWxhYmxlTW9kZWxzID0gW11cclxuICAgIGlmICghJG1ldGFkYXRhLm1vZGVscykgJG1ldGFkYXRhLm1vZGVscz1bXVxyXG4gICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxyXG5cclxuICAgIC8vIGNvbnZlcnNpb24gZnJvbSBvbGQgc3RyaW5nIGxpc3RcclxuICAgIGZvcihsZXQgaT0wOyBpPCRtZXRhZGF0YS5tb2RlbHMubGVuZ3RoO2krKykge1xyXG4gICAgICAgIGxldCBtb2RlbD0kbWV0YWRhdGEubW9kZWxzW2ldXHJcbiAgICAgICAgaWYgKHR5cGVvZiBtb2RlbCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBsZXQgbW9kZWxPYmo9e3BhdGg6bW9kZWx9XHJcbiAgICAgICAgICAgICRtZXRhZGF0YS5tb2RlbHNbaV09bW9kZWxPYmpcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gV3JpdGFibGUgc3RvcmUgZm9yIHNlbGVjdGVkIG1vZGVsXHJcbmxldCBzZWxlY3RlZE1vZGVsID0gJyc7XHJcblxyXG5mdW5jdGlvbiBmaW5kTW9kZWwobW9kZWxQYXRoKSB7XHJcbiAgICBmb3IobGV0IGk9MDsgaTwkbWV0YWRhdGEubW9kZWxzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICBsZXQgbW9kZWw9JG1ldGFkYXRhLm1vZGVsc1tpXVxyXG4gICAgICAgIGlmIChtb2RlbC5wYXRoPT09bW9kZWxQYXRoKSByZXR1cm4gbW9kZWxcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZVxyXG59XHJcbi8vIEZ1bmN0aW9uIHRvIGFkZCBhIG1vZGVsXHJcbmZ1bmN0aW9uIGFkZE1vZGVsKCkge1xyXG4gICAgaWYgKCFzZWxlY3RlZE1vZGVsKSByZXR1cm5cclxuICAgIGlmIChmaW5kTW9kZWwoc2VsZWN0ZWRNb2RlbCkpIHJldHVyblxyXG4gICAgJG1ldGFkYXRhLm1vZGVscy5wdXNoKHtwYXRoOnNlbGVjdGVkTW9kZWx9KVxyXG4gICAgJG1ldGFkYXRhLm1vZGVscz0kbWV0YWRhdGEubW9kZWxzXHJcbiAgICBzZWxlY3RlZE1vZGVsID0gJycgLy8gUmVzZXQgc2VsZWN0ZWQgbW9kZWwgYWZ0ZXIgYWRkaW5nICAgIFxyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB0byByZW1vdmUgYSBtb2RlbFxyXG5mdW5jdGlvbiByZW1vdmVNb2RlbChpbmRleCkge1xyXG4gICRtZXRhZGF0YS5tb2RlbHMuc3BsaWNlKGluZGV4LDEpXHJcbiAgJG1ldGFkYXRhLm1vZGVscz0kbWV0YWRhdGEubW9kZWxzXHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uIHRvIGNoZWNrIGlmIGEgbW9kZWwgaXMgbm90IGZvdW5kIGluIGF2YWlsYWJsZU1vZGVsc1xyXG5mdW5jdGlvbiBtb2RlbE5vdEZvdW5kKG1vZGVsUGF0aCkge1xyXG4gIHJldHVybiAhYXZhaWxhYmxlTW9kZWxzLmluY2x1ZGVzKG1vZGVsUGF0aClcclxufVxyXG4gIC8vIEZ1bmN0aW9uIHRvIGNsZWFuIHBhdGggb25seSBmaWxlIG5hbWVcclxuICBmdW5jdGlvbiBjbGVhblZhbHVlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvXFxzKlxcKC4qP1xcKVxccyovZywgJycpLnRyaW0oKTtcclxuICB9XHJcbiAvLyBGdW5jdGlvbiB0byBhZGQgbW9kZWxzIGZyb20gd29ya2Zsb3dcclxuIGZ1bmN0aW9uIGFkZE1vZGVsc0Zyb21Xb3JrZmxvdygpIHtcclxuICAgIGxldCBjb21ib1ZhbHVlcz1uZXcgbWFwcGluZ3NIZWxwZXIoKS5nZXRTZWxlY3RlZENvbWJvVmFsdWVzKClcclxuICAgIGxldCBjdXJyZW50TW9kZWxzID0gJG1ldGFkYXRhLm1vZGVsc1xyXG4gICAgbGV0IHJ1bGVzPSRtZXRhZGF0YS5ydWxlc1xyXG4gICAgaWYgKHJ1bGVzKSB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxydWxlcy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBydWxlPXJ1bGVzW2ldXHJcbiAgICAgICAgICAgIGlmIChydWxlLmFjdGlvblR5cGU9PT1cInNldFZhbHVlXCIgJiYgcnVsZS5hY3Rpb25WYWx1ZS5pbmNsdWRlcyhcIi5cIikpIGNvbWJvVmFsdWVzLnB1c2gocnVsZS5hY3Rpb25WYWx1ZSlcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpPTA7aTxjb21ib1ZhbHVlcy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlPWNsZWFuVmFsdWUoY29tYm9WYWx1ZXNbaV0pXHJcbiAgICAgICAgYXZhaWxhYmxlTW9kZWxzLmZvckVhY2goYXZhaWxhYmxlTW9kZWwgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYXZhaWxhYmxlTW9kZWwuaW5jbHVkZXModmFsdWUpICYmICFmaW5kTW9kZWwoYXZhaWxhYmxlTW9kZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAkbWV0YWRhdGEubW9kZWxzLnB1c2goe3BhdGg6YXZhaWxhYmxlTW9kZWx9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgICRtZXRhZGF0YS5tb2RlbHM9JG1ldGFkYXRhLm1vZGVsc1xyXG4gIH1cclxuXHJcbmxldCBkb3dubG9hZGluZ05vdz1mYWxzZVxyXG5hc3luYyBmdW5jdGlvbiBkb3dubG9hZE1vZGVscygpIHtcclxuICAgIGxldCByZXNwb25zZT1hd2FpdCBmZXRjaChcIi9neXJlL2Rvd25sb2FkX3Byb2dyZXNzXCIpXHJcbiAgICBsZXQgcmVzPWF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgaWYgKGRvd25sb2FkaW5nTm93IHx8IE9iamVjdC5rZXlzKHJlcykubGVuZ3RoKSB7XHJcbiAgICAgICAgYWxlcnQoXCJBbHJlYWR5IGRvd25sb2FkaW5nIG1vZGVsc1wiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBkb3dubG9hZGluZ05vdz10cnVlXHJcbiAgICAgICAgc3RhcnRQcm9ncmVzcygpXHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvZ3lyZS9kb3dubG9hZF9tb2RlbHM/aWQ9XCIrJG1ldGFkYXRhLndvcmtmbG93aWQpICBcclxuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpOyAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGRvd25sb2FkaW5nTm93PWZhbHNlXHJcbiAgICAgICAvLyBhbGVydChcIkVycm9yIGRvd25sb2FkaW5nIG1vZGVscyAgXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbn1cclxubGV0IHByb2dyZXNzPXt9XHJcbmxldCBpbnRlcnZhbElEPTBcclxuYXN5bmMgZnVuY3Rpb24gc3RhcnRQcm9ncmVzcygpIHtcclxuICAgIHByb2dyZXNzPXt9XHJcbiAgICBpZiAoaW50ZXJ2YWxJRCkgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElEKVxyXG4gICAgXHJcbiAgICBpbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4geyBcclxuICAgICAgICBsZXQgcmVzcG9uc2U9YXdhaXQgZmV0Y2goXCIvZ3lyZS9kb3dubG9hZF9wcm9ncmVzc1wiKVxyXG4gICAgICAgIHByb2dyZXNzPWF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgICRtZXRhZGF0YS5tb2RlbHM9JG1ldGFkYXRhLm1vZGVscyAgIC8vIHJlZnJlc2ggdGVtcGxhdGVcclxuICAgICAgICBpZiAoICFPYmplY3Qua2V5cyhwcm9ncmVzcykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKFwiZG93bmxvYWRGaW5pc2hlZFwiKVxyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSUQpXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJG1ldGFkYXRhLm1vZGVscz0kbWV0YWRhdGEubW9kZWxzXHJcbiAgICAgICAgICAgICB9LDEwMDApXHJcbiAgICAgICAgICAgIGRvd25sb2FkaW5nTm93PWZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgfSw1MDApXHJcbn1cclxuXHJcbm9uTW91bnQoYXN5bmMgKCkgPT4ge1xyXG4gICAgc3RhcnRQcm9ncmVzcygpICAgICAvLyBjaGVjayBwcm9ncmVzcyBhZnRlciBwYWdlIHJlbG9hZFxyXG59KVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZT5cclxuLm5vdC1mb3VuZCB7XHJcbiAgY29sb3I6ICNmZjZlNmU7XHJcbn1cclxuLm1vZGVsRW50cnkge1xyXG4gICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgLypoZWlnaHQ6IDI0cHg7Ki9cclxufVxyXG4ubW9kZWxFbnRyeSAuZGVsZXRlSWNvbiB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgdG9wOiAwcHg7XHJcbiAgICByaWdodDogMTBweDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxufVxyXG4ubW9kZWxFbnRyeTpob3ZlciAuZGVsZXRlSWNvbiB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxufVxyXG4ubW9kZWxFbnRyeTpob3ZlciAuaW5wdXRVUkwge1xyXG4gICAgb3BhY2l0eTogMS4wO1xyXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzO1xyXG59XHJcbi5pbnB1dCB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgICAgIHBhZGRpbmc6IDNweDtcclxuICAgICAgICB3aWR0aDogY2FsYygxMDAlIC0gMzBweCk7XHJcbiAgICB9XHJcbmgxIHtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbn0gICAgXHJcbi5wcm9ncmVzc0JhckNvbnRhaW5lciB7XHJcbiAgICB3aWR0aDogY2FsYygxMDAlIC0gMzBweCk7XHJcbiAgICBtYXJnaW4tdG9wOjEzcHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOjEzcHg7ICAgXHJcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwOyBcclxufVxyXG4ucHJvZ3Jlc3Mge1xyXG4gICAgaGVpZ2h0OiAxMHB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XHJcbiAgICB0cmFuc2l0aW9uOiAwLjFzO1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG5cclxufVxyXG4uaW5wdXRVUkwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcblxyXG4gICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG59XHJcbjwvc3R5bGU+XHJcblxyXG48ZGl2PlxyXG48aDE+TW9kZWwgTGlzdDwvaDE+XHJcbjx1bD5cclxuICB7I2VhY2ggJG1ldGFkYXRhLm1vZGVscyBhcyBtb2RlbCwgaW5kZXh9XHJcbiAgICA8bGkgY2xhc3M9e21vZGVsTm90Rm91bmQobW9kZWwucGF0aCkgJiYgIXByb2dyZXNzW21vZGVsLnBhdGhdID8gJ21vZGVsRW50cnkgbm90LWZvdW5kJyA6ICdtb2RlbEVudHJ5J30gPlxyXG4gICAgICB7bW9kZWwucGF0aH1cclxuICAgICAgeyNpZiBwcm9ncmVzc1ttb2RlbC5wYXRoXX1cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NCYXJDb250YWluZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzXCIgc3R5bGU9XCJ3aWR0aDp7cGFyc2VJbnQocHJvZ3Jlc3NbbW9kZWwucGF0aF0pfSU7XCI+PC9kaXY+IHtwYXJzZUludChwcm9ncmVzc1ttb2RlbC5wYXRoXSl9JVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICB7L2lmfVxyXG4gICAgICB7I2lmICFub19lZGl0ICYmICFwcm9ncmVzc1ttb2RlbC5wYXRoXX1cclxuICAgICAgICA8ZGl2PjxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiU291cmNlIFVSTFwiIGJpbmQ6dmFsdWU9e21vZGVsLlVSTH0gY2xhc3M9XCJpbnB1dCBpbnB1dFVSTFwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkZWxldGVJY29uXCI+XHJcbiAgICAgICAgICAgIDxJY29uIG5hbWU9XCJkZWFjdGl2YXRlZFwiIG9uOmNsaWNrPXsoZSk9PntyZW1vdmVNb2RlbChpbmRleCl9fSB0aXRsZT1cIlJlbW92ZSBmcm9tIGxpc3QgLSBpdCB3aWxsIGJlIG5vdCBkZWxldGVkIGluIGZpbGVzeXN0ZW0uXCI+PC9JY29uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvaWZ9XHJcbiAgICA8L2xpPlxyXG4gICAgXHJcbiAgey9lYWNofVxyXG48L3VsPlxyXG5cclxueyNpZiAhbm9fZWRpdH1cclxuICAgIDxkaXY+XHJcbiAgICA8c2VsZWN0IGJpbmQ6dmFsdWU9e3NlbGVjdGVkTW9kZWx9IGNsYXNzPVwiaW5wdXRcIj5cclxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCIgZGlzYWJsZWQ+U2VsZWN0IGEgbW9kZWw8L29wdGlvbj5cclxuICAgICAgICB7I2VhY2ggYXZhaWxhYmxlTW9kZWxzIGFzIG1vZGVsfVxyXG4gICAgICAgIDxvcHRpb24gdmFsdWU9e21vZGVsfT57bW9kZWx9PC9vcHRpb24+XHJcbiAgICAgICAgey9lYWNofVxyXG4gICAgPC9zZWxlY3Q+XHJcbiAgICB7I2lmICFkb3dubG9hZGluZ05vd31cclxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXthZGRNb2RlbH0+QWRkIE1vZGVsPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiBvbjpjbGljaz17YWRkTW9kZWxzRnJvbVdvcmtmbG93fT5Gcm9tIFdvcmtmbG93PC9idXR0b24+XHJcbiAgICB7L2lmfVxyXG4gICAgPC9kaXY+XHJcbnsvaWZ9XHJcbnsjaWYgIWRvd25sb2FkaW5nTm93fVxyXG4gICAgPGJ1dHRvbiBvbjpjbGljaz17ZG93bmxvYWRNb2RlbHN9PkRvd25sb2FkIG1pc3NpbmcgTW9kZWxzPC9idXR0b24+XHJcbnsvaWZ9XHJcbjwvZGl2PiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUErSEEsc0NBQVcsQ0FDVCxLQUFLLENBQUUsT0FDVCxDQUNBLHVDQUFZLENBQ1IsZUFBZSxDQUFFLElBQUksQ0FDckIsUUFBUSxDQUFFLFFBRWQsQ0FDQSx5QkFBVyxDQUFDLHlCQUFZLENBQ3BCLE9BQU8sQ0FBRSxJQUFJLENBQ2IsR0FBRyxDQUFFLEdBQUcsQ0FDUixLQUFLLENBQUUsSUFBSSxDQUNYLFFBQVEsQ0FBRSxRQUNkLENBQ0EseUJBQVcsTUFBTSxDQUFDLHlCQUFZLENBQzFCLE9BQU8sQ0FBRSxLQUNiLENBQ0EseUJBQVcsTUFBTSxDQUFDLHVCQUFVLENBQ3hCLE9BQU8sQ0FBRSxHQUFHLENBQ1osVUFBVSxDQUFFLE9BQU8sQ0FBQyxJQUN4QixDQUNBLGtDQUFPLENBQ0MsZ0JBQWdCLENBQUUsS0FBSyxDQUN2QixLQUFLLENBQUUsS0FBSyxDQUNaLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLE9BQU8sQ0FBRSxHQUFHLENBQ1osS0FBSyxDQUFFLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzNCLENBQ0osOEJBQUcsQ0FDQyxTQUFTLENBQUUsSUFBSSxDQUNmLGFBQWEsQ0FBRSxJQUNuQixDQUNBLGlEQUFzQixDQUNsQixLQUFLLENBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUN4QixXQUFXLElBQUksQ0FDZixjQUFjLElBQUksQ0FDbEIsV0FBVyxDQUFFLE1BQ2pCLENBQ0EscUNBQVUsQ0FDTixNQUFNLENBQUUsSUFBSSxDQUNaLGdCQUFnQixDQUFFLEtBQUssQ0FDdkIsVUFBVSxDQUFFLElBQUksQ0FDaEIsT0FBTyxDQUFFLFlBRWIsQ0FDQSxxQ0FBVSxDQUNOLGdCQUFnQixDQUFFLFdBQVcsQ0FFN0IsVUFBVSxDQUFFLElBQUksQ0FDaEIsYUFBYSxDQUFFLElBQUksQ0FDbkIsT0FBTyxDQUFFLENBQ2IifQ== */");
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[21] = list;
    	child_ctx[22] = i;
    	return child_ctx;
    }

    // (188:6) {#if progress[model.path]}
    function create_if_block_4$2(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = parseInt(/*progress*/ ctx[4][/*model*/ ctx[18].path]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = text("%");
    			attr_dev(div0, "class", "progress svelte-184ory");
    			set_style(div0, "width", parseInt(/*progress*/ ctx[4][/*model*/ ctx[18].path]) + "%");
    			add_location(div0, file$4, 189, 12, 5405);
    			attr_dev(div1, "class", "progressBarContainer svelte-184ory");
    			add_location(div1, file$4, 188, 8, 5357);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*progress, $metadata*/ 48) {
    				set_style(div0, "width", parseInt(/*progress*/ ctx[4][/*model*/ ctx[18].path]) + "%");
    			}

    			if (dirty & /*progress, $metadata*/ 48 && t1_value !== (t1_value = parseInt(/*progress*/ ctx[4][/*model*/ ctx[18].path]) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(188:6) {#if progress[model.path]}",
    		ctx
    	});

    	return block;
    }

    // (193:6) {#if !no_edit && !progress[model.path]}
    function create_if_block_3$2(ctx) {
    	let div0;
    	let input;
    	let t;
    	let div1;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[11].call(input, /*each_value_1*/ ctx[21], /*index*/ ctx[22]);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[12](/*index*/ ctx[22], ...args);
    	}

    	icon = new Icon({
    			props: {
    				name: "deactivated",
    				title: "Remove from list - it will be not deleted in filesystem."
    			},
    			$$inline: true
    		});

    	icon.$on("click", click_handler);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input = element("input");
    			t = space();
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Source URL");
    			attr_dev(input, "class", "input inputURL svelte-184ory");
    			add_location(input, file$4, 193, 13, 5607);
    			add_location(div0, file$4, 193, 8, 5602);
    			attr_dev(div1, "class", "deleteIcon svelte-184ory");
    			add_location(div1, file$4, 194, 8, 5713);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			set_input_value(input, /*model*/ ctx[18].URL);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(icon, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$metadata*/ 32 && input.value !== /*model*/ ctx[18].URL) {
    				set_input_value(input, /*model*/ ctx[18].URL);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(193:6) {#if !no_edit && !progress[model.path]}",
    		ctx
    	});

    	return block;
    }

    // (185:2) {#each $metadata.models as model, index}
    function create_each_block_1$4(ctx) {
    	let li;
    	let t0_value = /*model*/ ctx[18].path + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let li_class_value;
    	let current;
    	let if_block0 = /*progress*/ ctx[4][/*model*/ ctx[18].path] && create_if_block_4$2(ctx);
    	let if_block1 = !/*no_edit*/ ctx[0] && !/*progress*/ ctx[4][/*model*/ ctx[18].path] && create_if_block_3$2(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();

    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*modelNotFound*/ ctx[8](/*model*/ ctx[18].path) && !/*progress*/ ctx[4][/*model*/ ctx[18].path]
    			? 'modelEntry not-found'
    			: 'modelEntry') + " svelte-184ory"));

    			add_location(li, file$4, 185, 4, 5189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			if (if_block0) if_block0.m(li, null);
    			append_dev(li, t2);
    			if (if_block1) if_block1.m(li, null);
    			append_dev(li, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$metadata*/ 32) && t0_value !== (t0_value = /*model*/ ctx[18].path + "")) set_data_dev(t0, t0_value);

    			if (/*progress*/ ctx[4][/*model*/ ctx[18].path]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$2(ctx);
    					if_block0.c();
    					if_block0.m(li, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*no_edit*/ ctx[0] && !/*progress*/ ctx[4][/*model*/ ctx[18].path]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*no_edit, progress, $metadata*/ 49) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(li, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$metadata, progress*/ 48 && li_class_value !== (li_class_value = "" + (null_to_empty(/*modelNotFound*/ ctx[8](/*model*/ ctx[18].path) && !/*progress*/ ctx[4][/*model*/ ctx[18].path]
    			? 'modelEntry not-found'
    			: 'modelEntry') + " svelte-184ory"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(185:2) {#each $metadata.models as model, index}",
    		ctx
    	});

    	return block;
    }

    // (204:0) {#if !no_edit}
    function create_if_block_1$3(ctx) {
    	let div;
    	let select;
    	let option;
    	let t1;
    	let mounted;
    	let dispose;
    	let each_value = /*availableModels*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	let if_block = !/*downloadingNow*/ ctx[3] && create_if_block_2$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "Select a model";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (if_block) if_block.c();
    			option.__value = "";
    			option.value = option.__value;
    			option.disabled = true;
    			add_location(option, file$4, 206, 8, 6045);
    			attr_dev(select, "class", "input svelte-184ory");
    			if (/*selectedModel*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[13].call(select));
    			add_location(select, file$4, 205, 4, 5986);
    			add_location(div, file$4, 204, 4, 5975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*selectedModel*/ ctx[2], true);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*availableModels*/ 2) {
    				each_value = /*availableModels*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selectedModel, availableModels*/ 6) {
    				select_option(select, /*selectedModel*/ ctx[2]);
    			}

    			if (!/*downloadingNow*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$3(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(204:0) {#if !no_edit}",
    		ctx
    	});

    	return block;
    }

    // (208:8) {#each availableModels as model}
    function create_each_block$4(ctx) {
    	let option;
    	let t_value = /*model*/ ctx[18] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*model*/ ctx[18];
    			option.value = option.__value;
    			add_location(option, file$4, 208, 8, 6146);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*availableModels*/ 2 && t_value !== (t_value = /*model*/ ctx[18] + "")) set_data_dev(t, t_value);

    			if (dirty & /*availableModels*/ 2 && option_value_value !== (option_value_value = /*model*/ ctx[18])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(208:8) {#each availableModels as model}",
    		ctx
    	});

    	return block;
    }

    // (212:4) {#if !downloadingNow}
    function create_if_block_2$3(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Add Model";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "From Workflow";
    			add_location(button0, file$4, 212, 8, 6253);
    			add_location(button1, file$4, 213, 8, 6309);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*addModel*/ ctx[6], false, false, false, false),
    					listen_dev(button1, "click", /*addModelsFromWorkflow*/ ctx[9], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(212:4) {#if !downloadingNow}",
    		ctx
    	});

    	return block;
    }

    // (218:0) {#if !downloadingNow}
    function create_if_block$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Download missing Models";
    			add_location(button, file$4, 218, 4, 6431);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*downloadModels*/ ctx[10], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(218:0) {#if !downloadingNow}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let ul;
    	let t2;
    	let t3;
    	let current;
    	let each_value_1 = /*$metadata*/ ctx[5].models;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block0 = !/*no_edit*/ ctx[0] && create_if_block_1$3(ctx);
    	let if_block1 = !/*downloadingNow*/ ctx[3] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Model List";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h1, "class", "svelte-184ory");
    			add_location(h1, file$4, 182, 0, 5114);
    			add_location(ul, file$4, 183, 0, 5135);
    			add_location(div, file$4, 181, 0, 5107);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(div, t2);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t3);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*modelNotFound, $metadata, progress, removeModel, no_edit, parseInt*/ 433) {
    				each_value_1 = /*$metadata*/ ctx[5].models;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!/*no_edit*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(div, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*downloadingNow*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
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

    function cleanValue(value) {
    	return value.replace(/\s*\(.*?\)\s*/g, '').trim();
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(5, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditModels', slots, []);
    	let { no_edit = false } = $$props;
    	let { availableModels = [] } = $$props;
    	if (!$metadata.models) set_store_value(metadata, $metadata.models = [], $metadata);
    	const dispatch = createEventDispatcher();

    	// conversion from old string list
    	for (let i = 0; i < $metadata.models.length; i++) {
    		let model = $metadata.models[i];

    		if (typeof model === "string") {
    			let modelObj = { path: model };
    			set_store_value(metadata, $metadata.models[i] = modelObj, $metadata);
    		}
    	}

    	// Writable store for selected model
    	let selectedModel = '';

    	function findModel(modelPath) {
    		for (let i = 0; i < $metadata.models.length; i++) {
    			let model = $metadata.models[i];
    			if (model.path === modelPath) return model;
    		}

    		return false;
    	}

    	// Function to add a model
    	function addModel() {
    		if (!selectedModel) return;
    		if (findModel(selectedModel)) return;
    		$metadata.models.push({ path: selectedModel });
    		metadata.set($metadata);
    		$$invalidate(2, selectedModel = ''); // Reset selected model after adding    
    	}

    	// Function to remove a model
    	function removeModel(index) {
    		$metadata.models.splice(index, 1);
    		metadata.set($metadata);
    	}

    	// Function to check if a model is not found in availableModels
    	function modelNotFound(modelPath) {
    		return !availableModels.includes(modelPath);
    	}

    	// Function to add models from workflow
    	function addModelsFromWorkflow() {
    		let comboValues = new mappingsHelper().getSelectedComboValues();
    		$metadata.models;
    		let rules = $metadata.rules;

    		if (rules) {
    			for (let i = 0; i < rules.length; i++) {
    				let rule = rules[i];
    				if (rule.actionType === "setValue" && rule.actionValue.includes(".")) comboValues.push(rule.actionValue);
    			}
    		}

    		for (let i = 0; i < comboValues.length; i++) {
    			let value = cleanValue(comboValues[i]);

    			availableModels.forEach(availableModel => {
    				if (availableModel.includes(value) && !findModel(availableModel)) {
    					$metadata.models.push({ path: availableModel });
    				}
    			});
    		}

    		metadata.set($metadata);
    	}

    	let downloadingNow = false;

    	async function downloadModels() {
    		let response = await fetch("/gyre/download_progress");
    		let res = await response.json();

    		if (downloadingNow || Object.keys(res).length) {
    			alert("Already downloading models");
    			return;
    		}

    		try {
    			$$invalidate(3, downloadingNow = true);
    			startProgress();
    			let response = await fetch("/gyre/download_models?id=" + $metadata.workflowid);
    			let result = await response.json();
    			return result;
    		} catch(error) {
    			$$invalidate(3, downloadingNow = false);
    		} // alert("Error downloading models  " + error);
    	}

    	let progress = {};
    	let intervalID = 0;

    	async function startProgress() {
    		$$invalidate(4, progress = {});
    		if (intervalID) clearInterval(intervalID);

    		intervalID = setInterval(
    			async () => {
    				let response = await fetch("/gyre/download_progress");
    				$$invalidate(4, progress = await response.json());
    				set_store_value(metadata, $metadata.models = $metadata.models, $metadata); // refresh template

    				if (!Object.keys(progress).length) {
    					dispatch("downloadFinished");
    					clearInterval(intervalID);

    					setTimeout(
    						() => {
    							metadata.set($metadata);
    						},
    						1000
    					);

    					$$invalidate(3, downloadingNow = false);
    				}
    			},
    			500
    		);
    	}

    	onMount(async () => {
    		startProgress(); // check progress after page reload
    	});

    	const writable_props = ['no_edit', 'availableModels'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EditModels> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler(each_value_1, index) {
    		each_value_1[index].URL = this.value;
    		metadata.set($metadata);
    	}

    	const click_handler = (index, e) => {
    		removeModel(index);
    	};

    	function select_change_handler() {
    		selectedModel = select_value(this);
    		$$invalidate(2, selectedModel);
    		$$invalidate(1, availableModels);
    	}

    	$$self.$$set = $$props => {
    		if ('no_edit' in $$props) $$invalidate(0, no_edit = $$props.no_edit);
    		if ('availableModels' in $$props) $$invalidate(1, availableModels = $$props.availableModels);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		metadata,
    		mappingsHelper,
    		Icon,
    		no_edit,
    		availableModels,
    		dispatch,
    		selectedModel,
    		findModel,
    		addModel,
    		removeModel,
    		modelNotFound,
    		cleanValue,
    		addModelsFromWorkflow,
    		downloadingNow,
    		downloadModels,
    		progress,
    		intervalID,
    		startProgress,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('no_edit' in $$props) $$invalidate(0, no_edit = $$props.no_edit);
    		if ('availableModels' in $$props) $$invalidate(1, availableModels = $$props.availableModels);
    		if ('selectedModel' in $$props) $$invalidate(2, selectedModel = $$props.selectedModel);
    		if ('downloadingNow' in $$props) $$invalidate(3, downloadingNow = $$props.downloadingNow);
    		if ('progress' in $$props) $$invalidate(4, progress = $$props.progress);
    		if ('intervalID' in $$props) intervalID = $$props.intervalID;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		no_edit,
    		availableModels,
    		selectedModel,
    		downloadingNow,
    		progress,
    		$metadata,
    		addModel,
    		removeModel,
    		modelNotFound,
    		addModelsFromWorkflow,
    		downloadModels,
    		input_input_handler,
    		click_handler,
    		select_change_handler
    	];
    }

    class EditModels extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { no_edit: 0, availableModels: 1 }, add_css$5);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditModels",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get no_edit() {
    		throw new Error("<EditModels>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set no_edit(value) {
    		throw new Error("<EditModels>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get availableModels() {
    		throw new Error("<EditModels>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set availableModels(value) {
    		throw new Error("<EditModels>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\InputCombo.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;
    const file$3 = "src\\InputCombo.svelte";

    function add_css$4(target) {
    	append_styles(target, "svelte-12v7n6u", ".input.svelte-12v7n6u.svelte-12v7n6u{background-color:black;color:white;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}.input.svelte-12v7n6u option.svelte-12v7n6u{background-color:black;color:white}.input.svelte-12v7n6u optgroup.svelte-12v7n6u{background-color:black;color:white}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5wdXRDb21iby5zdmVsdGUiLCJzb3VyY2VzIjpbIklucHV0Q29tYm8uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgXHJcblxyXG4gIGltcG9ydCB7bWV0YWRhdGF9IGZyb20gXCIuL3N0b3Jlcy9tZXRhZGF0YVwiO1xyXG4gIGltcG9ydCB7IG1hcHBpbmdzSGVscGVyIH0gZnJvbSAnLi9tYXBwaW5nc0hlbHBlci5qcydcclxuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJ1xyXG5cclxuICBleHBvcnQgbGV0IHZhbHVlPVwiXCJcclxuICBpbXBvcnQgSWNvbiBmcm9tICcuL0ljb24uc3ZlbHRlJ1xyXG4gIGxldCBzaG93Qm94PWZhbHNlXHJcblxyXG4gIG9uTW91bnQoKCkgPT4ge1xyXG4gICAgICAgIGlmKCEkbWV0YWRhdGEuY29tYm9fdmFsdWVzKSAkbWV0YWRhdGEuY29tYm9fdmFsdWVzID0ge31cclxuICAgICAgICBsZXQgbWg9bmV3IG1hcHBpbmdzSGVscGVyKClcclxuICAgICAgICBtaC5zZXRDb21ib1ZhbHVlcygkbWV0YWRhdGEuY29tYm9fdmFsdWVzKVxyXG4gIH0pXHJcbiAgPC9zY3JpcHQ+XHJcbiAgXHJcbiAgPHN0eWxlPlxyXG4gICAgXHJcbiAgICAuaW5wdXQge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBwYWRkaW5nOiAzcHg7XHJcbiAgICB9XHJcbiAgICAuaW5wdXQgb3B0aW9uIHtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gICAgLmlucHV0IG9wdGdyb3VwIHtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gIDwvc3R5bGU+XHJcbjxpbnB1dCB0eXBlPVwidGV4dFwiIHt2YWx1ZX0gY2xhc3M9XCJpbnB1dFwiIG9uOmNoYW5nZT17KGUpID0+IHsgdmFsdWU9ZS50YXJnZXQudmFsdWU7IHNob3dCb3g9ZmFsc2V9fT48SWNvbiBuYW1lPVwiY29tYm9MaXN0XCIgb246Y2xpY2s9eyhlKSA9PiB7c2hvd0JveD10cnVlfX0+PC9JY29uPlxyXG57I2lmIHNob3dCb3h9XHJcbiAgPHNlbGVjdCBjbGFzcz1cImlucHV0XCIgb246Y2hhbmdlPXsoZSkgPT4geyB2YWx1ZT1lLnRhcmdldC52YWx1ZTsgc2hvd0JveD1mYWxzZX19PlxyXG4gICAgPG9wdGlvbj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgIHsjZWFjaCBPYmplY3QuZW50cmllcygkbWV0YWRhdGEuY29tYm9fdmFsdWVzKSBhcyBbdGl0bGUsdmFsdWVzXX1cclxuICAgICAgPG9wdGdyb3VwIGxhYmVsPXt0aXRsZX0+XHJcbiAgICAgIHsjZWFjaCB2YWx1ZXMgYXMgdn1cclxuICAgICAgICA8b3B0aW9uIHt2fT57dn08L29wdGlvbj5cclxuICAgICAgey9lYWNofVxyXG4gICAgPC9vcHRncm91cD5cclxuICAgIHsvZWFjaH1cclxuICA8L3NlbGVjdD5cclxuey9pZn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBb0JJLG9DQUFPLENBQ0gsZ0JBQWdCLENBQUUsS0FBSyxDQUN2QixLQUFLLENBQUUsS0FBSyxDQUNaLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLE9BQU8sQ0FBRSxHQUNiLENBQ0EscUJBQU0sQ0FBQyxxQkFBTyxDQUNaLGdCQUFnQixDQUFFLEtBQUssQ0FDckIsS0FBSyxDQUFFLEtBQ1gsQ0FDQSxxQkFBTSxDQUFDLHVCQUFTLENBQ2QsZ0JBQWdCLENBQUUsS0FBSyxDQUNyQixLQUFLLENBQUUsS0FDWCJ9 */");
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i][0];
    	child_ctx[7] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (37:0) {#if showBox}
    function create_if_block$3(ctx) {
    	let select;
    	let option;
    	let mounted;
    	let dispose;
    	let each_value = Object.entries(/*$metadata*/ ctx[2].combo_values);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			option = element("option");
    			option.textContent = "Select...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			option.__value = "Select...";
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-12v7n6u");
    			add_location(option, file$3, 38, 4, 1141);
    			attr_dev(select, "class", "input svelte-12v7n6u");
    			add_location(select, file$3, 37, 2, 1055);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*change_handler_1*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, $metadata*/ 4) {
    				each_value = Object.entries(/*$metadata*/ ctx[2].combo_values);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(37:0) {#if showBox}",
    		ctx
    	});

    	return block;
    }

    // (42:6) {#each values as v}
    function create_each_block_1$3(ctx) {
    	let option;
    	let t_value = /*v*/ ctx[10] + "";
    	let t;
    	let option_v_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "v", option_v_value = /*v*/ ctx[10]);
    			option.__value = option_value_value = /*v*/ ctx[10];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-12v7n6u");
    			add_location(option, file$3, 42, 8, 1306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$metadata*/ 4 && t_value !== (t_value = /*v*/ ctx[10] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$metadata*/ 4 && option_v_value !== (option_v_value = /*v*/ ctx[10])) {
    				attr_dev(option, "v", option_v_value);
    			}

    			if (dirty & /*$metadata*/ 4 && option_value_value !== (option_value_value = /*v*/ ctx[10])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(42:6) {#each values as v}",
    		ctx
    	});

    	return block;
    }

    // (40:4) {#each Object.entries($metadata.combo_values) as [title,values]}
    function create_each_block$3(ctx) {
    	let optgroup;
    	let optgroup_label_value;
    	let each_value_1 = /*values*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			optgroup = element("optgroup");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(optgroup, "label", optgroup_label_value = /*title*/ ctx[6]);
    			attr_dev(optgroup, "class", "svelte-12v7n6u");
    			add_location(optgroup, file$3, 40, 6, 1245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, optgroup, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(optgroup, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, $metadata*/ 4) {
    				each_value_1 = /*values*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(optgroup, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*$metadata*/ 4 && optgroup_label_value !== (optgroup_label_value = /*title*/ ctx[6])) {
    				attr_dev(optgroup, "label", optgroup_label_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(optgroup);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(40:4) {#each Object.entries($metadata.combo_values) as [title,values]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let input;
    	let icon;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { name: "comboList" },
    			$$inline: true
    		});

    	icon.$on("click", /*click_handler*/ ctx[4]);
    	let if_block = /*showBox*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			input = element("input");
    			create_component(icon.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input, "type", "text");
    			input.value = /*value*/ ctx[0];
    			attr_dev(input, "class", "input svelte-12v7n6u");
    			add_location(input, file$3, 35, 0, 874);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			mount_component(icon, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				prop_dev(input, "value", /*value*/ ctx[0]);
    			}

    			if (/*showBox*/ ctx[1]) {
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			destroy_component(icon, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
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
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(2, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputCombo', slots, []);
    	let { value = "" } = $$props;
    	let showBox = false;

    	onMount(() => {
    		if (!$metadata.combo_values) set_store_value(metadata, $metadata.combo_values = {}, $metadata);
    		let mh = new mappingsHelper();
    		mh.setComboValues($metadata.combo_values);
    	});

    	const writable_props = ['value'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputCombo> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => {
    		$$invalidate(0, value = e.target.value);
    		$$invalidate(1, showBox = false);
    	};

    	const click_handler = e => {
    		$$invalidate(1, showBox = true);
    	};

    	const change_handler_1 = e => {
    		$$invalidate(0, value = e.target.value);
    		$$invalidate(1, showBox = false);
    	};

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		metadata,
    		mappingsHelper,
    		onMount,
    		value,
    		Icon,
    		showBox,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('showBox' in $$props) $$invalidate(1, showBox = $$props.showBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, showBox, $metadata, change_handler, click_handler, change_handler_1];
    }

    class InputCombo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { value: 0 }, add_css$4);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputCombo",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get value() {
    		throw new Error("<InputCombo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputCombo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\RuleEditor.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\RuleEditor.svelte";

    function add_css$3(target) {
    	append_styles(target, "svelte-14rkto5", ".rule-row.svelte-14rkto5.svelte-14rkto5{position:relative;padding:10px;border:1px solid #ccc;margin-bottom:5px}.rule-row.svelte-14rkto5:hover .edit-button.svelte-14rkto5{display:block}.edit-button.svelte-14rkto5.svelte-14rkto5{display:none;position:absolute;top:0;right:0;cursor:pointer;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;padding:5px}.close-button.svelte-14rkto5.svelte-14rkto5{position:absolute;top:5px;right:5px;cursor:pointer}.action-row.svelte-14rkto5.svelte-14rkto5{}.oneLine.svelte-14rkto5.svelte-14rkto5{display:inline-block;margin-right:10px;width:120px;font-size:14px}.input.svelte-14rkto5.svelte-14rkto5{background-color:black;color:white;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}.rightValue.svelte-14rkto5.svelte-14rkto5{width:150px}.ruleEditor.svelte-14rkto5 button.svelte-14rkto5{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}.ruleEditor.svelte-14rkto5 .delete.svelte-14rkto5{background-color:red;color:white}.ruleEditor.svelte-14rkto5 h1.svelte-14rkto5{font-size:16px;margin-bottom:30px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVsZUVkaXRvci5zdmVsdGUiLCJzb3VyY2VzIjpbIlJ1bGVFZGl0b3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgXHJcbiAgICBcclxuXHJcbiAgICBpbXBvcnQgeyBtZXRhZGF0YX0gZnJvbSAnLi9zdG9yZXMvbWV0YWRhdGEnXHJcbiAgICBpbXBvcnQgSW5wdXRDb21ibyAgZnJvbSAnLi9JbnB1dENvbWJvLnN2ZWx0ZSdcclxuICAgIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tICdzdmVsdGUnO1xyXG4gICAgaW1wb3J0IHsgbWFwcGluZ3NIZWxwZXIgfSBmcm9tICcuL21hcHBpbmdzSGVscGVyLmpzJ1xyXG4gICAgZXhwb3J0IGxldCBub19lZGl0PWZhbHNlXHJcblxyXG4gICAgbGV0IG1IPW5ldyBtYXBwaW5nc0hlbHBlcigpXHJcblxyXG4gICAgbGV0IE1hcHBpbmdzQ29wbXBvbmVudFxyXG4gICAgbGV0IGNvbmRpdGlvbnMgPSBbJz09JywgJyE9JywgJz4nLCAnPCcsICc+PScsICc8PSddO1xyXG4gICAgbGV0IGVkaXRpbmdJbmRleCA9IG51bGw7IC8vIEluZGV4IG9mIHRoZSBjdXJyZW50bHkgZWRpdGluZyBydWxlXHJcbiAgICBpZiAoISRtZXRhZGF0YS5ydWxlcykgJG1ldGFkYXRhLnJ1bGVzPVtdXHJcbiAgICBsZXQgZmllbGRzPSRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzIC8vIGdldCBmb3JtIGZpZWxkc1xyXG4gICAgbGV0IHJ1bGVzID0gJG1ldGFkYXRhLnJ1bGVzXHJcbiAgICBsZXQgbWFwcGluZ0ZpZWxkcz17ZGVmYXVsdGZpZWxkczpbXX1cclxuICAgIGZ1bmN0aW9uIGFkZFJ1bGUoKSB7XHJcbiAgICAgIHJ1bGVzLnB1c2goeyBmaWVsZE5hbWU6ICcnLCBjb25kaXRpb246ICcnLCBhY3Rpb25UeXBlOiAnJywgcmlnaHRWYWx1ZTonJywgdGFyZ2V0RmllbGQ6ICcnLCBhY3Rpb25WYWx1ZTogJycgfSk7XHJcbiAgICAgIHJ1bGVzPXJ1bGVzXHJcbiAgICAgIGVkaXRpbmdJbmRleD1ydWxlcy5sZW5ndGgtMVxyXG4gICAgICAkbWV0YWRhdGEucnVsZXMgPSBydWxlcztcclxuICAgIH1cclxuICAgIG9uTW91bnQoKCkgPT4ge1xyXG4gICAgICBtYXBwaW5nRmllbGRzPW1ILmdldE1hcHBpbmdGaWVsZHMoJG1ldGFkYXRhKVxyXG4gICAgfSk7XHJcbiAgICBmdW5jdGlvbiBkZWxldGVSdWxlKGluZGV4KSB7XHJcbiAgICAgIHJ1bGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGlmIChlZGl0aW5nSW5kZXggPT09IGluZGV4KSB7XHJcbiAgICAgICAgZWRpdGluZ0luZGV4ID0gbnVsbDsgLy8gUmVzZXQgZWRpdGluZyBpbmRleCBpZiB0aGUgY3VycmVudGx5IGVkaXRlZCBydWxlIGlzIGRlbGV0ZWRcclxuICAgICAgfVxyXG4gICAgICBydWxlcz1ydWxlc1xyXG4gICAgICAkbWV0YWRhdGEucnVsZXMgPSBydWxlcztcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNsb25lUnVsZShpbmRleCkge1xyXG4gICAgICBsZXQgcnVsZT1ydWxlc1tpbmRleF1cclxuICAgICAgcnVsZT1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJ1bGUpKVxyXG4gICAgICBydWxlcy5wdXNoKHJ1bGUpXHJcbiAgICAgIGVkaXRpbmdJbmRleD1ydWxlcy5sZW5ndGgtMVxyXG4gICAgICAkbWV0YWRhdGEucnVsZXMgPSBydWxlcztcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGVkaXRSdWxlKGluZGV4KSB7XHJcbiAgICAgIGVkaXRpbmdJbmRleCA9IGluZGV4O1xyXG4gICAgfVxyXG4gIDwvc2NyaXB0PlxyXG4gIFxyXG4gIDxzdHlsZT5cclxuICAgIC5ydWxlLXJvdyB7XHJcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgcGFkZGluZzogMTBweDtcclxuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcclxuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xyXG4gICAgfVxyXG4gICAgLnJ1bGUtcm93OmhvdmVyIC5lZGl0LWJ1dHRvbiB7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgfVxyXG4gICAgLmVkaXQtYnV0dG9uIHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICB0b3A6IDA7XHJcbiAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDtcclxuICAgIH1cclxuICAgIC5jbG9zZS1idXR0b24ge1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIHRvcDogNXB4O1xyXG4gICAgICByaWdodDogNXB4O1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcblxyXG4gICAgfSAgICBcclxuICAgIC5hY3Rpb24tcm93IHtcclxuXHJcbiAgICB9XHJcbiAgICAub25lTGluZSB7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgICAgICB3aWR0aDoxMjBweDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcblxyXG4gICAgfVxyXG4gICAgLmlucHV0IHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgcGFkZGluZzogM3B4O1xyXG4gICAgfVxyXG4gICAgLnJpZ2h0VmFsdWUge1xyXG4gICAgICAgIHdpZHRoOiAxNTBweDtcclxuICAgIH1cclxuICAgIC5ydWxlRWRpdG9yIGJ1dHRvbiB7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIG1pbi13aWR0aDogNzBweDtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogcmdiKDEyOCwgMTI4LCAxMjgpO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfVxyXG4gICAgLnJ1bGVFZGl0b3IgLmRlbGV0ZSB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIH1cclxuICAgIC5ydWxlRWRpdG9yIGgxIHtcclxuICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gICAgfVxyXG4gIDwvc3R5bGU+XHJcbiAgXHJcblxyXG4gPGRpdiBjbGFzcz1cInJ1bGVFZGl0b3JcIj5cclxuICA8aDE+UnVsZXM8L2gxPlxyXG5cclxuICB7I2VhY2ggcnVsZXMgYXMgcnVsZSwgaW5kZXh9XHJcbiAgICA8ZGl2IGNsYXNzPVwicnVsZS1yb3dcIj5cclxuICAgICAgeyNpZiBlZGl0aW5nSW5kZXggPT09IGluZGV4fVxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNsb3NlLWJ1dHRvblwiIG9uOmNsaWNrPXsoKSA9PiB7IGVkaXRpbmdJbmRleD0tMSB9fT5YPC9kaXY+XHJcblxyXG4gICAgICAgIDwhLS0gSW5wdXRzIGZvciBlZGl0aW5nIC0tPlxyXG5cclxuICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17cnVsZS5maWVsZE5hbWV9ICBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPkZpZWxkLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkZvcm1cIj5cclxuICAgICAgICAgICAgICB7I2VhY2ggZmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiRGVmYXVsdHNcIj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCBtYXBwaW5nRmllbGRzLmRlZmF1bHRGaWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17cnVsZS5jb25kaXRpb259IGNsYXNzPVwib25lTGluZSBpbnB1dFwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+Q29uZGl0aW9uLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsjZWFjaCBjb25kaXRpb25zIGFzIGNvbmRpdGlvbn1cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtjb25kaXRpb259Pntjb25kaXRpb259PC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJpbnB1dCByaWdodFZhbHVlXCIgcGxhY2Vob2xkZXI9XCJWYWx1ZVwiIGJpbmQ6dmFsdWU9e3J1bGUucmlnaHRWYWx1ZX0+XHJcblxyXG4gICAgICAgICAgPHNlbGVjdCBiaW5kOnZhbHVlPXtydWxlLmFjdGlvblR5cGV9ICBjbGFzcz1cImlucHV0XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5BY3Rpb24uLi48L29wdGlvbj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNldFZhbHVlXCI+U2V0IHZhbHVlPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzaG93RmllbGRcIj5TaG93IGFub3RoZXIgZmllbGQ8L29wdGlvbj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImhpZGVGaWVsZFwiPkhpZGUgYW5vdGhlciBmaWVsZDwvb3B0aW9uPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiY29weVBhcmFtZXRlclwiPkNvcHkgcGFyYW1ldGVyIGZyb20gYW5vdGhlciBmaWVsZDwvb3B0aW9uPlxyXG4gICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgeyNpZiBydWxlLmFjdGlvblR5cGUgPT09ICdzZXRWYWx1ZSd9XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uLXJvd1wiPlxyXG4gICAgICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17cnVsZS50YXJnZXRGaWVsZH0gY2xhc3M9XCJvbmVMaW5lIGlucHV0XCI+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+RmllbGQuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkZvcm1cIj5cclxuICAgICAgICAgICAgICAgICAgeyNlYWNoIGZpZWxkcyBhcyBmaWVsZH1cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtmaWVsZC5uYW1lfT57ZmllbGQubmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgPC9vcHRncm91cD5cclxuICAgICAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkRlZmF1bHRzXCI+XHJcbiAgICAgICAgICAgICAgICAgIHsjZWFjaCBtYXBwaW5nRmllbGRzLmRlZmF1bHRGaWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgPSA8SW5wdXRDb21ibyAgYmluZDp2YWx1ZT17cnVsZS5hY3Rpb25WYWx1ZX0gfT48L0lucHV0Q29tYm8+XHJcbiAgICAgICAgICAgICAgPCEtLSA8aW5wdXQgdHlwZT1cInRleHRcIiBiaW5kOnZhbHVlPXtydWxlLmFjdGlvblZhbHVlfSBwbGFjZWhvbGRlcj1cIlZhbHVlXCIgIGNsYXNzPVwib25lTGluZSBpbnB1dFwiIHN0eWxlPVwid2lkdGg6MjcwcHhcIj4tLT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvaWZ9XHJcbiAgICAgICAgeyNpZiBydWxlLmFjdGlvblR5cGUgPT09ICdzaG93RmllbGQnIHx8IHJ1bGUuYWN0aW9uVHlwZSA9PT0gJ2hpZGVGaWVsZCd9XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbi1yb3dcIj5cclxuICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17cnVsZS50YXJnZXRGaWVsZH0gY2xhc3M9XCJvbmVMaW5lIGlucHV0XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5GaWVsZC4uLjwvb3B0aW9uPlxyXG4gICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJGb3JtXCI+ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB7I2VhY2ggZmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgeyNpZiBmaWVsZCE9PXJ1bGUuZmllbGROYW1lICYmIGZpZWxkLnR5cGUhPT1cImxheWVyX2ltYWdlXCIgJiYgZmllbGQudHlwZSE9PVwibWFnbmlmaWVyXCIgJiYgZmllbGQudHlwZSE9PVwiYWR2YW5jZWRfb3B0aW9uc1wifVxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtmaWVsZC5uYW1lfT57ZmllbGQubmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICA8L29wdGdyb3VwPiAgICAgICAgICAgIFxyXG4gICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwhLS0gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgYmluZDp2YWx1ZT17cnVsZS5hY3Rpb25WYWx1ZX0gcGxhY2Vob2xkZXI9XCJWYWx1ZVwiICBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIiBzdHlsZT1cIndpZHRoOjI3MHB4XCI+LS0+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvaWZ9XHJcbiAgICAgICAgeyNpZiBydWxlLmFjdGlvblR5cGUgPT09ICdjb3B5VmFsdWUnIHx8IHJ1bGUuYWN0aW9uVHlwZSA9PT0gJ2NvcHlQYXJhbWV0ZXInfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhY3Rpb24tcm93XCI+IENvcHkgXHJcbiAgICAgICAgICA8c2VsZWN0IGJpbmQ6dmFsdWU9e3J1bGUuYWN0aW9uVmFsdWV9IGNsYXNzPVwib25lTGluZSBpbnB1dFwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+RnJvbSBGaWVsZC4uLjwvb3B0aW9uPlxyXG4gICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJGb3JtXCI+ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB7I2VhY2ggZmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgeyNpZiBmaWVsZCE9PXJ1bGUuZmllbGROYW1lICYmIGZpZWxkLnR5cGUhPT1cImxheWVyX2ltYWdlXCIgJiYgZmllbGQudHlwZSE9PVwibWFnbmlmaWVyXCIgJiYgZmllbGQudHlwZSE9PVwiYWR2YW5jZWRfb3B0aW9uc1wifVxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtmaWVsZC5uYW1lfT57ZmllbGQubmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICA8L29wdGdyb3VwPiAgICAgICAgICAgIFxyXG4gICAgICAgICAgPC9zZWxlY3Q+XHJcblxyXG4gICAgICAgICAgPHNlbGVjdCBiaW5kOnZhbHVlPXtydWxlLnRhcmdldEZpZWxkfSBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlRvIEZpZWxkLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkZvcm1cIj4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIHsjZWFjaCBmaWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICB7I2lmIGZpZWxkIT09cnVsZS5maWVsZE5hbWUgJiYgZmllbGQudHlwZSE9PVwibGF5ZXJfaW1hZ2VcIiAmJiBmaWVsZC50eXBlIT09XCJtYWduaWZpZXJcIiAmJiBmaWVsZC50eXBlIT09XCJhZHZhbmNlZF9vcHRpb25zXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgIDwvb3B0Z3JvdXA+ICAgICAgICAgICAgXHJcbiAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgIHsjaWYgcnVsZS5hY3Rpb25UeXBlID09PSAnY29weVBhcmFtZXRlcid9XHJcbiAgICAgICAgICAgPGlucHV0IGJpbmQ6dmFsdWU9e3J1bGUudGFyZ2V0UGFyYW1ldGVyfSBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIj5cclxuICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICA8IS0tIDxpbnB1dCB0eXBlPVwidGV4dFwiIGJpbmQ6dmFsdWU9e3J1bGUuYWN0aW9uVmFsdWV9IHBsYWNlaG9sZGVyPVwiVmFsdWVcIiAgY2xhc3M9XCJvbmVMaW5lIGlucHV0XCIgc3R5bGU9XCJ3aWR0aDoyNzBweFwiPi0tPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgICB7L2lmfVxyXG4gICAgICAgIDxkaXY+PGJ1dHRvbiBvbjpjbGljaz17KCkgPT4gZGVsZXRlUnVsZShpbmRleCl9IGNsYXNzPVwiZGVsZXRlXCI+RGVsZXRlPC9idXR0b24+IDxidXR0b24gb246Y2xpY2s9eygpID0+IGNsb25lUnVsZShpbmRleCl9IGNsYXNzPVwiXCI+Q2xvbmU8L2J1dHRvbj48L2Rpdj5cclxuICAgICAgICBcclxuXHJcbiAgICAgIHs6ZWxzZX1cclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgIHsjaWYgIW5vX2VkaXR9XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZWRpdC1idXR0b25cIiBvbjpjbGljaz17KCkgPT4gZWRpdFJ1bGUoaW5kZXgpfT5FZGl0PC9kaXY+XHJcbiAgICAgICAgey9pZn1cclxuXHJcbiAgICAgICAgPCEtLSBEaXNwbGF5IFJ1bGUgU3VtbWFyeSAtLT5cclxuICAgICAgICA8ZGl2PiBpZiB7cnVsZS5maWVsZE5hbWV9IHtydWxlLmNvbmRpdGlvbn0ge3J1bGUucmlnaHRWYWx1ZX06IFxyXG4gICAgICAgICAgeyNpZiBydWxlLmFjdGlvblR5cGU9PT1cInNldFZhbHVlXCJ9c2V0IHtydWxlLnRhcmdldEZpZWxkfT17cnVsZS5hY3Rpb25WYWx1ZX17L2lmfVxyXG4gICAgICAgICAgeyNpZiBydWxlLmFjdGlvblR5cGU9PT1cInNob3dGaWVsZFwifXNob3cge3J1bGUudGFyZ2V0RmllbGR9ey9pZn1cclxuICAgICAgICAgIHsjaWYgcnVsZS5hY3Rpb25UeXBlPT09XCJoaWRlRmllbGRcIn1oaWRlIHtydWxlLnRhcmdldEZpZWxkfXsvaWZ9XHJcbiAgICAgICAgICB7I2lmIHJ1bGUuYWN0aW9uVHlwZT09PVwiY29weVZhbHVlXCJ9Y29weSB7cnVsZS5hY3Rpb25WYWx1ZX0gdG8ge3J1bGUudGFyZ2V0RmllbGR9ey9pZn1cclxuICAgICAgICAgIHsjaWYgcnVsZS5hY3Rpb25UeXBlPT09XCJjb3B5UGFyYW1ldGVyXCJ9Y29weSB7cnVsZS5hY3Rpb25WYWx1ZX0gdG8ge3J1bGUudGFyZ2V0RmllbGR9LntydWxlLnRhcmdldFBhcmFtZXRlcn17L2lmfVxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgey9pZn1cclxuICAgIDwvZGl2PlxyXG4gIHsvZWFjaH1cclxuICB7I2lmICFub19lZGl0fVxyXG4gICAgICA8YnV0dG9uIG9uOmNsaWNrPXthZGRSdWxlfT5BZGQgUnVsZTwvYnV0dG9uPlxyXG4gIHsvaWZ9XHJcbjwvZGl2PlxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBaURJLHVDQUFVLENBQ1IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLElBQUksQ0FDYixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RCLGFBQWEsQ0FBRSxHQUNqQixDQUNBLHdCQUFTLE1BQU0sQ0FBQywyQkFBYSxDQUMzQixPQUFPLENBQUUsS0FDWCxDQUNBLDBDQUFhLENBQ1gsT0FBTyxDQUFFLElBQUksQ0FDYixRQUFRLENBQUUsUUFBUSxDQUNsQixHQUFHLENBQUUsQ0FBQyxDQUNOLEtBQUssQ0FBRSxDQUFDLENBQ1IsTUFBTSxDQUFFLE9BQU8sQ0FDZixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUNqSSxLQUFLLENBQUUsS0FBSyxDQUNaLGdCQUFnQixDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ3BDLFlBQVksQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNoQyxhQUFhLENBQUUsR0FBRyxDQUNsQixPQUFPLENBQUUsR0FDYixDQUNBLDJDQUFjLENBQ1osUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLEdBQUcsQ0FDUixLQUFLLENBQUUsR0FBRyxDQUNWLE1BQU0sQ0FBRSxPQUVWLENBQ0EseUNBQVksQ0FFWixDQUNBLHNDQUFTLENBQ0wsT0FBTyxDQUFFLFlBQVksQ0FDckIsWUFBWSxDQUFFLElBQUksQ0FDbEIsTUFBTSxLQUFLLENBQ1gsU0FBUyxDQUFFLElBRWYsQ0FDQSxvQ0FBTyxDQUNILGdCQUFnQixDQUFFLEtBQUssQ0FDdkIsS0FBSyxDQUFFLEtBQUssQ0FDWixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUNuSSxPQUFPLENBQUUsR0FDYixDQUNBLHlDQUFZLENBQ1IsS0FBSyxDQUFFLEtBQ1gsQ0FDQSwwQkFBVyxDQUFDLHFCQUFPLENBQ2YsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksU0FBUyxDQUFFLElBQUksQ0FDZixTQUFTLENBQUUsSUFBSSxDQUNmLEtBQUssQ0FBRSxLQUFLLENBQ1osZ0JBQWdCLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDcEMsWUFBWSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ2hDLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsWUFBWSxDQUFFLElBQ2xCLENBQ0EsMEJBQVcsQ0FBQyxzQkFBUSxDQUNoQixnQkFBZ0IsQ0FBRSxHQUFHLENBQ3JCLEtBQUssQ0FBRSxLQUNYLENBQ0EsMEJBQVcsQ0FBQyxpQkFBRyxDQUNiLFNBQVMsQ0FBRSxJQUFJLENBQ2YsYUFBYSxDQUFFLElBQ2pCIn0= */");
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	child_ctx[28] = list;
    	child_ctx[29] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_5$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_6$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    // (226:6) {:else}
    function create_else_block$2(ctx) {
    	let t0;
    	let div;
    	let t1;
    	let t2_value = /*rule*/ ctx[27].fieldName + "";
    	let t2;
    	let t3;
    	let t4_value = /*rule*/ ctx[27].condition + "";
    	let t4;
    	let t5;
    	let t6_value = /*rule*/ ctx[27].rightValue + "";
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let if_block0 = !/*no_edit*/ ctx[0] && create_if_block_14$1(ctx);
    	let if_block1 = /*rule*/ ctx[27].actionType === "setValue" && create_if_block_13$1(ctx);
    	let if_block2 = /*rule*/ ctx[27].actionType === "showField" && create_if_block_12$1(ctx);
    	let if_block3 = /*rule*/ ctx[27].actionType === "hideField" && create_if_block_11$1(ctx);
    	let if_block4 = /*rule*/ ctx[27].actionType === "copyValue" && create_if_block_10$1(ctx);
    	let if_block5 = /*rule*/ ctx[27].actionType === "copyParameter" && create_if_block_9$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div = element("div");
    			t1 = text("if ");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = text(": \r\n          ");
    			if (if_block1) if_block1.c();
    			t8 = space();
    			if (if_block2) if_block2.c();
    			t9 = space();
    			if (if_block3) if_block3.c();
    			t10 = space();
    			if (if_block4) if_block4.c();
    			t11 = space();
    			if (if_block5) if_block5.c();
    			add_location(div, file$2, 232, 8, 8650);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, t5);
    			append_dev(div, t6);
    			append_dev(div, t7);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t8);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t9);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t10);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t11);
    			if (if_block5) if_block5.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*no_edit*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_14$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*rules*/ 4 && t2_value !== (t2_value = /*rule*/ ctx[27].fieldName + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*rules*/ 4 && t4_value !== (t4_value = /*rule*/ ctx[27].condition + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*rules*/ 4 && t6_value !== (t6_value = /*rule*/ ctx[27].rightValue + "")) set_data_dev(t6, t6_value);

    			if (/*rule*/ ctx[27].actionType === "setValue") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_13$1(ctx);
    					if_block1.c();
    					if_block1.m(div, t8);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*rule*/ ctx[27].actionType === "showField") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_12$1(ctx);
    					if_block2.c();
    					if_block2.m(div, t9);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*rule*/ ctx[27].actionType === "hideField") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_11$1(ctx);
    					if_block3.c();
    					if_block3.m(div, t10);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*rule*/ ctx[27].actionType === "copyValue") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_10$1(ctx);
    					if_block4.c();
    					if_block4.m(div, t11);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*rule*/ ctx[27].actionType === "copyParameter") {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_9$1(ctx);
    					if_block5.c();
    					if_block5.m(div, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(226:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (125:6) {#if editingIndex === index}
    function create_if_block_1$2(ctx) {
    	let div0;
    	let t1;
    	let select0;
    	let option0;
    	let optgroup0;
    	let optgroup1;
    	let t3;
    	let select1;
    	let option1;
    	let t5;
    	let input;
    	let t6;
    	let select2;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let div1;
    	let button0;
    	let t17;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_8 = /*fields*/ ctx[5];
    	validate_each_argument(each_value_8);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_8.length; i += 1) {
    		each_blocks_2[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
    	}

    	let each_value_7 = /*mappingFields*/ ctx[3].defaultFields;
    	validate_each_argument(each_value_7);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		each_blocks_1[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
    	}

    	function select0_change_handler() {
    		/*select0_change_handler*/ ctx[11].call(select0, /*each_value*/ ctx[28], /*index*/ ctx[29]);
    	}

    	let each_value_6 = /*conditions*/ ctx[4];
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6$1(get_each_context_6$1(ctx, each_value_6, i));
    	}

    	function select1_change_handler() {
    		/*select1_change_handler*/ ctx[12].call(select1, /*each_value*/ ctx[28], /*index*/ ctx[29]);
    	}

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[13].call(input, /*each_value*/ ctx[28], /*index*/ ctx[29]);
    	}

    	function select2_change_handler() {
    		/*select2_change_handler*/ ctx[14].call(select2, /*each_value*/ ctx[28], /*index*/ ctx[29]);
    	}

    	let if_block0 = /*rule*/ ctx[27].actionType === 'setValue' && create_if_block_8$1(ctx);
    	let if_block1 = (/*rule*/ ctx[27].actionType === 'showField' || /*rule*/ ctx[27].actionType === 'hideField') && create_if_block_6$1(ctx);
    	let if_block2 = (/*rule*/ ctx[27].actionType === 'copyValue' || /*rule*/ ctx[27].actionType === 'copyParameter') && create_if_block_2$2(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[21](/*index*/ ctx[29]);
    	}

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[22](/*index*/ ctx[29]);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "X";
    			t1 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Field...";
    			optgroup0 = element("optgroup");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			optgroup1 = element("optgroup");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Condition...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			input = element("input");
    			t6 = space();
    			select2 = element("select");
    			option2 = element("option");
    			option2.textContent = "Action...";
    			option3 = element("option");
    			option3.textContent = "Set value";
    			option4 = element("option");
    			option4.textContent = "Show another field";
    			option5 = element("option");
    			option5.textContent = "Hide another field";
    			option6 = element("option");
    			option6.textContent = "Copy parameter from another field";
    			t12 = space();
    			if (if_block0) if_block0.c();
    			t13 = space();
    			if (if_block1) if_block1.c();
    			t14 = space();
    			if (if_block2) if_block2.c();
    			t15 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Delete";
    			t17 = space();
    			button1 = element("button");
    			button1.textContent = "Clone";
    			attr_dev(div0, "class", "close-button svelte-14rkto5");
    			add_location(div0, file$2, 126, 8, 3550);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 131, 12, 3746);
    			attr_dev(optgroup0, "label", "Form");
    			add_location(optgroup0, file$2, 132, 12, 3794);
    			attr_dev(optgroup1, "label", "Defaults");
    			add_location(optgroup1, file$2, 137, 14, 3988);
    			attr_dev(select0, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[27].fieldName === void 0) add_render_callback(select0_change_handler);
    			add_location(select0, file$2, 130, 10, 3673);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 144, 12, 4302);
    			attr_dev(select1, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[27].condition === void 0) add_render_callback(select1_change_handler);
    			add_location(select1, file$2, 143, 10, 4230);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "input rightValue svelte-14rkto5");
    			attr_dev(input, "placeholder", "Value");
    			add_location(input, file$2, 149, 10, 4501);
    			option2.__value = "";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 152, 12, 4674);
    			option3.__value = "setValue";
    			option3.value = option3.__value;
    			add_location(option3, file$2, 153, 12, 4723);
    			option4.__value = "showField";
    			option4.value = option4.__value;
    			add_location(option4, file$2, 154, 12, 4780);
    			option5.__value = "hideField";
    			option5.value = option5.__value;
    			add_location(option5, file$2, 155, 12, 4847);
    			option6.__value = "copyParameter";
    			option6.value = option6.__value;
    			add_location(option6, file$2, 156, 12, 4914);
    			attr_dev(select2, "class", "input svelte-14rkto5");
    			if (/*rule*/ ctx[27].actionType === void 0) add_render_callback(select2_change_handler);
    			add_location(select2, file$2, 151, 10, 4608);
    			attr_dev(button0, "class", "delete svelte-14rkto5");
    			add_location(button0, file$2, 222, 13, 8242);
    			attr_dev(button1, "class", " svelte-14rkto5");
    			add_location(button1, file$2, 222, 87, 8316);
    			add_location(div1, file$2, 222, 8, 8237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select0, anchor);
    			append_dev(select0, option0);
    			append_dev(select0, optgroup0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(optgroup0, null);
    				}
    			}

    			append_dev(select0, optgroup1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(optgroup1, null);
    				}
    			}

    			select_option(select0, /*rule*/ ctx[27].fieldName, true);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, select1, anchor);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select1, null);
    				}
    			}

    			select_option(select1, /*rule*/ ctx[27].condition, true);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*rule*/ ctx[27].rightValue);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, select2, anchor);
    			append_dev(select2, option2);
    			append_dev(select2, option3);
    			append_dev(select2, option4);
    			append_dev(select2, option5);
    			append_dev(select2, option6);
    			select_option(select2, /*rule*/ ctx[27].actionType, true);
    			insert_dev(target, t12, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t13, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t14, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(div1, t17);
    			append_dev(div1, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[10], false, false, false, false),
    					listen_dev(select0, "change", select0_change_handler),
    					listen_dev(select1, "change", select1_change_handler),
    					listen_dev(input, "input", input_input_handler),
    					listen_dev(select2, "change", select2_change_handler),
    					listen_dev(button0, "click", click_handler_1, false, false, false, false),
    					listen_dev(button1, "click", click_handler_2, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*fields*/ 32) {
    				each_value_8 = /*fields*/ ctx[5];
    				validate_each_argument(each_value_8);
    				let i;

    				for (i = 0; i < each_value_8.length; i += 1) {
    					const child_ctx = get_each_context_8(ctx, each_value_8, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_8(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_8.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 8) {
    				each_value_7 = /*mappingFields*/ ctx[3].defaultFields;
    				validate_each_argument(each_value_7);
    				let i;

    				for (i = 0; i < each_value_7.length; i += 1) {
    					const child_ctx = get_each_context_7(ctx, each_value_7, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_7(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_7.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select0, /*rule*/ ctx[27].fieldName);
    			}

    			if (dirty[0] & /*conditions*/ 16) {
    				each_value_6 = /*conditions*/ ctx[4];
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6$1(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_6$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_6.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select1, /*rule*/ ctx[27].condition);
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44 && input.value !== /*rule*/ ctx[27].rightValue) {
    				set_input_value(input, /*rule*/ ctx[27].rightValue);
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select2, /*rule*/ ctx[27].actionType);
    			}

    			if (/*rule*/ ctx[27].actionType === 'setValue') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*rules*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t13.parentNode, t13);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*rule*/ ctx[27].actionType === 'showField' || /*rule*/ ctx[27].actionType === 'hideField') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6$1(ctx);
    					if_block1.c();
    					if_block1.m(t14.parentNode, t14);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*rule*/ ctx[27].actionType === 'copyValue' || /*rule*/ ctx[27].actionType === 'copyParameter') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$2(ctx);
    					if_block2.c();
    					if_block2.m(t15.parentNode, t15);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select0);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(select1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(select2);
    			if (detaching) detach_dev(t12);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t13);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t14);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(125:6) {#if editingIndex === index}",
    		ctx
    	});

    	return block;
    }

    // (228:8) {#if !no_edit}
    function create_if_block_14$1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[23](/*index*/ ctx[29]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Edit";
    			attr_dev(div, "class", "edit-button svelte-14rkto5");
    			add_location(div, file$2, 228, 10, 8516);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_3, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14$1.name,
    		type: "if",
    		source: "(228:8) {#if !no_edit}",
    		ctx
    	});

    	return block;
    }

    // (234:10) {#if rule.actionType==="setValue"}
    function create_if_block_13$1(ctx) {
    	let t0;
    	let t1_value = /*rule*/ ctx[27].targetField + "";
    	let t1;
    	let t2;
    	let t3_value = /*rule*/ ctx[27].actionValue + "";
    	let t3;

    	const block = {
    		c: function create() {
    			t0 = text("set ");
    			t1 = text(t1_value);
    			t2 = text("=");
    			t3 = text(t3_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*rules*/ 4 && t1_value !== (t1_value = /*rule*/ ctx[27].targetField + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*rules*/ 4 && t3_value !== (t3_value = /*rule*/ ctx[27].actionValue + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13$1.name,
    		type: "if",
    		source: "(234:10) {#if rule.actionType===\\\"setValue\\\"}",
    		ctx
    	});

    	return block;
    }

    // (235:10) {#if rule.actionType==="showField"}
    function create_if_block_12$1(ctx) {
    	let t0;
    	let t1_value = /*rule*/ ctx[27].targetField + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("show ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*rules*/ 4 && t1_value !== (t1_value = /*rule*/ ctx[27].targetField + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(235:10) {#if rule.actionType===\\\"showField\\\"}",
    		ctx
    	});

    	return block;
    }

    // (236:10) {#if rule.actionType==="hideField"}
    function create_if_block_11$1(ctx) {
    	let t0;
    	let t1_value = /*rule*/ ctx[27].targetField + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("hide ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*rules*/ 4 && t1_value !== (t1_value = /*rule*/ ctx[27].targetField + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(236:10) {#if rule.actionType===\\\"hideField\\\"}",
    		ctx
    	});

    	return block;
    }

    // (237:10) {#if rule.actionType==="copyValue"}
    function create_if_block_10$1(ctx) {
    	let t0;
    	let t1_value = /*rule*/ ctx[27].actionValue + "";
    	let t1;
    	let t2;
    	let t3_value = /*rule*/ ctx[27].targetField + "";
    	let t3;

    	const block = {
    		c: function create() {
    			t0 = text("copy ");
    			t1 = text(t1_value);
    			t2 = text(" to ");
    			t3 = text(t3_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*rules*/ 4 && t1_value !== (t1_value = /*rule*/ ctx[27].actionValue + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*rules*/ 4 && t3_value !== (t3_value = /*rule*/ ctx[27].targetField + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(237:10) {#if rule.actionType===\\\"copyValue\\\"}",
    		ctx
    	});

    	return block;
    }

    // (238:10) {#if rule.actionType==="copyParameter"}
    function create_if_block_9$1(ctx) {
    	let t0;
    	let t1_value = /*rule*/ ctx[27].actionValue + "";
    	let t1;
    	let t2;
    	let t3_value = /*rule*/ ctx[27].targetField + "";
    	let t3;
    	let t4;
    	let t5_value = /*rule*/ ctx[27].targetParameter + "";
    	let t5;

    	const block = {
    		c: function create() {
    			t0 = text("copy ");
    			t1 = text(t1_value);
    			t2 = text(" to ");
    			t3 = text(t3_value);
    			t4 = text(".");
    			t5 = text(t5_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*rules*/ 4 && t1_value !== (t1_value = /*rule*/ ctx[27].actionValue + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*rules*/ 4 && t3_value !== (t3_value = /*rule*/ ctx[27].targetField + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*rules*/ 4 && t5_value !== (t5_value = /*rule*/ ctx[27].targetParameter + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(238:10) {#if rule.actionType===\\\"copyParameter\\\"}",
    		ctx
    	});

    	return block;
    }

    // (134:14) {#each fields as field}
    function create_each_block_8(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[30].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[30].name;
    			option.value = option.__value;
    			add_location(option, file$2, 134, 16, 3874);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(134:14) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (139:16) {#each mappingFields.defaultFields as field}
    function create_each_block_7(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[30].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[30].name;
    			option.value = option.__value;
    			add_location(option, file$2, 139, 18, 4097);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 8 && t_value !== (t_value = /*field*/ ctx[30].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 8 && option_value_value !== (option_value_value = /*field*/ ctx[30].name)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(139:16) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (146:12) {#each conditions as condition}
    function create_each_block_6$1(ctx) {
    	let option;
    	let t_value = /*condition*/ ctx[41] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*condition*/ ctx[41];
    			option.value = option.__value;
    			add_location(option, file$2, 146, 14, 4401);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6$1.name,
    		type: "each",
    		source: "(146:12) {#each conditions as condition}",
    		ctx
    	});

    	return block;
    }

    // (159:8) {#if rule.actionType === 'setValue'}
    function create_if_block_8$1(ctx) {
    	let div;
    	let select;
    	let option;
    	let optgroup0;
    	let optgroup1;
    	let t1;
    	let inputcombo;
    	let updating_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_5 = /*fields*/ ctx[5];
    	validate_each_argument(each_value_5);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_1[i] = create_each_block_5$2(get_each_context_5$2(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*mappingFields*/ ctx[3].defaultFields;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4$2(get_each_context_4$2(ctx, each_value_4, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[15].call(select, /*each_value*/ ctx[28], /*index*/ ctx[29]);
    	}

    	function inputcombo_value_binding(value) {
    		/*inputcombo_value_binding*/ ctx[16](value, /*rule*/ ctx[27]);
    	}

    	let inputcombo_props = { "}": true };

    	if (/*rule*/ ctx[27].actionValue !== void 0) {
    		inputcombo_props.value = /*rule*/ ctx[27].actionValue;
    	}

    	inputcombo = new InputCombo({ props: inputcombo_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputcombo, 'value', inputcombo_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "Field...";
    			optgroup0 = element("optgroup");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			optgroup1 = element("optgroup");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = text("\r\n              = ");
    			create_component(inputcombo.$$.fragment);
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$2, 161, 16, 5183);
    			attr_dev(optgroup0, "label", "Form");
    			add_location(optgroup0, file$2, 162, 16, 5235);
    			attr_dev(optgroup1, "label", "Defaults");
    			add_location(optgroup1, file$2, 167, 16, 5445);
    			attr_dev(select, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[27].targetField === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$2, 160, 14, 5105);
    			attr_dev(div, "class", "action-row svelte-14rkto5");
    			add_location(div, file$2, 159, 10, 5065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);
    			append_dev(select, option);
    			append_dev(select, optgroup0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(optgroup0, null);
    				}
    			}

    			append_dev(select, optgroup1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(optgroup1, null);
    				}
    			}

    			select_option(select, /*rule*/ ctx[27].targetField, true);
    			append_dev(div, t1);
    			mount_component(inputcombo, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", select_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*fields*/ 32) {
    				each_value_5 = /*fields*/ ctx[5];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5$2(ctx, each_value_5, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_5$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_5.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 8) {
    				each_value_4 = /*mappingFields*/ ctx[3].defaultFields;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$2(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select, /*rule*/ ctx[27].targetField);
    			}

    			const inputcombo_changes = {};

    			if (!updating_value && dirty[0] & /*rules*/ 4) {
    				updating_value = true;
    				inputcombo_changes.value = /*rule*/ ctx[27].actionValue;
    				add_flush_callback(() => updating_value = false);
    			}

    			inputcombo.$set(inputcombo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputcombo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputcombo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(inputcombo);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(159:8) {#if rule.actionType === 'setValue'}",
    		ctx
    	});

    	return block;
    }

    // (164:18) {#each fields as field}
    function create_each_block_5$2(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[30].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[30].name;
    			option.value = option.__value;
    			add_location(option, file$2, 164, 20, 5323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5$2.name,
    		type: "each",
    		source: "(164:18) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (169:18) {#each mappingFields.defaultFields as field}
    function create_each_block_4$2(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[30].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[30].name;
    			option.value = option.__value;
    			add_location(option, file$2, 169, 20, 5558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 8 && t_value !== (t_value = /*field*/ ctx[30].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 8 && option_value_value !== (option_value_value = /*field*/ ctx[30].name)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$2.name,
    		type: "each",
    		source: "(169:18) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (178:8) {#if rule.actionType === 'showField' || rule.actionType === 'hideField'}
    function create_if_block_6$1(ctx) {
    	let div;
    	let select;
    	let option;
    	let optgroup;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*fields*/ ctx[5];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$2(get_each_context_3$2(ctx, each_value_3, i));
    	}

    	function select_change_handler_1() {
    		/*select_change_handler_1*/ ctx[17].call(select, /*each_value*/ ctx[28], /*index*/ ctx[29]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "Field...";
    			optgroup = element("optgroup");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$2, 180, 12, 6134);
    			attr_dev(optgroup, "label", "Form");
    			add_location(optgroup, file$2, 181, 12, 6182);
    			attr_dev(select, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[27].targetField === void 0) add_render_callback(select_change_handler_1);
    			add_location(select, file$2, 179, 10, 6060);
    			attr_dev(div, "class", "action-row svelte-14rkto5");
    			add_location(div, file$2, 178, 8, 6024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);
    			append_dev(select, option);
    			append_dev(select, optgroup);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(optgroup, null);
    				}
    			}

    			select_option(select, /*rule*/ ctx[27].targetField, true);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", select_change_handler_1);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*fields, rules*/ 36) {
    				each_value_3 = /*fields*/ ctx[5];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$2(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(optgroup, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select, /*rule*/ ctx[27].targetField);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(178:8) {#if rule.actionType === 'showField' || rule.actionType === 'hideField'}",
    		ctx
    	});

    	return block;
    }

    // (184:16) {#if field!==rule.fieldName && field.type!=="layer_image" && field.type!=="magnifier" && field.type!=="advanced_options"}
    function create_if_block_7$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[30].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[30].name;
    			option.value = option.__value;
    			add_location(option, file$2, 184, 18, 6417);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(184:16) {#if field!==rule.fieldName && field.type!==\\\"layer_image\\\" && field.type!==\\\"magnifier\\\" && field.type!==\\\"advanced_options\\\"}",
    		ctx
    	});

    	return block;
    }

    // (183:14) {#each fields as field}
    function create_each_block_3$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*field*/ ctx[30] !== /*rule*/ ctx[27].fieldName && /*field*/ ctx[30].type !== "layer_image" && /*field*/ ctx[30].type !== "magnifier" && /*field*/ ctx[30].type !== "advanced_options" && create_if_block_7$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*field*/ ctx[30] !== /*rule*/ ctx[27].fieldName && /*field*/ ctx[30].type !== "layer_image" && /*field*/ ctx[30].type !== "magnifier" && /*field*/ ctx[30].type !== "advanced_options") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_7$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$2.name,
    		type: "each",
    		source: "(183:14) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (194:8) {#if rule.actionType === 'copyValue' || rule.actionType === 'copyParameter'}
    function create_if_block_2$2(ctx) {
    	let div;
    	let t0;
    	let select0;
    	let option0;
    	let optgroup0;
    	let t2;
    	let select1;
    	let option1;
    	let optgroup1;
    	let t4;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*fields*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	function select0_change_handler_1() {
    		/*select0_change_handler_1*/ ctx[18].call(select0, /*each_value*/ ctx[28], /*index*/ ctx[29]);
    	}

    	let each_value_1 = /*fields*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	function select1_change_handler_1() {
    		/*select1_change_handler_1*/ ctx[19].call(select1, /*each_value*/ ctx[28], /*index*/ ctx[29]);
    	}

    	let if_block = /*rule*/ ctx[27].actionType === 'copyParameter' && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Copy \r\n          ");
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "From Field...";
    			optgroup0 = element("optgroup");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "To Field...";
    			optgroup1 = element("optgroup");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			if (if_block) if_block.c();
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 196, 12, 6954);
    			attr_dev(optgroup0, "label", "Form");
    			add_location(optgroup0, file$2, 197, 12, 7007);
    			attr_dev(select0, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[27].actionValue === void 0) add_render_callback(select0_change_handler_1);
    			add_location(select0, file$2, 195, 10, 6880);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 207, 12, 7482);
    			attr_dev(optgroup1, "label", "Form");
    			add_location(optgroup1, file$2, 208, 12, 7533);
    			attr_dev(select1, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[27].targetField === void 0) add_render_callback(select1_change_handler_1);
    			add_location(select1, file$2, 206, 10, 7408);
    			attr_dev(div, "class", "action-row svelte-14rkto5");
    			add_location(div, file$2, 194, 8, 6838);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, select0);
    			append_dev(select0, option0);
    			append_dev(select0, optgroup0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(optgroup0, null);
    				}
    			}

    			select_option(select0, /*rule*/ ctx[27].actionValue, true);
    			append_dev(div, t2);
    			append_dev(div, select1);
    			append_dev(select1, option1);
    			append_dev(select1, optgroup1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(optgroup1, null);
    				}
    			}

    			select_option(select1, /*rule*/ ctx[27].targetField, true);
    			append_dev(div, t4);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", select0_change_handler_1),
    					listen_dev(select1, "change", select1_change_handler_1)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*fields, rules*/ 36) {
    				each_value_2 = /*fields*/ ctx[5];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select0, /*rule*/ ctx[27].actionValue);
    			}

    			if (dirty[0] & /*fields, rules*/ 36) {
    				each_value_1 = /*fields*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select1, /*rule*/ ctx[27].targetField);
    			}

    			if (/*rule*/ ctx[27].actionType === 'copyParameter') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(194:8) {#if rule.actionType === 'copyValue' || rule.actionType === 'copyParameter'}",
    		ctx
    	});

    	return block;
    }

    // (200:16) {#if field!==rule.fieldName && field.type!=="layer_image" && field.type!=="magnifier" && field.type!=="advanced_options"}
    function create_if_block_5$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[30].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[30].name;
    			option.value = option.__value;
    			add_location(option, file$2, 200, 18, 7242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(200:16) {#if field!==rule.fieldName && field.type!==\\\"layer_image\\\" && field.type!==\\\"magnifier\\\" && field.type!==\\\"advanced_options\\\"}",
    		ctx
    	});

    	return block;
    }

    // (199:14) {#each fields as field}
    function create_each_block_2$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*field*/ ctx[30] !== /*rule*/ ctx[27].fieldName && /*field*/ ctx[30].type !== "layer_image" && /*field*/ ctx[30].type !== "magnifier" && /*field*/ ctx[30].type !== "advanced_options" && create_if_block_5$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*field*/ ctx[30] !== /*rule*/ ctx[27].fieldName && /*field*/ ctx[30].type !== "layer_image" && /*field*/ ctx[30].type !== "magnifier" && /*field*/ ctx[30].type !== "advanced_options") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(199:14) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (211:16) {#if field!==rule.fieldName && field.type!=="layer_image" && field.type!=="magnifier" && field.type!=="advanced_options"}
    function create_if_block_4$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[30].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[30].name;
    			option.value = option.__value;
    			add_location(option, file$2, 211, 18, 7768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(211:16) {#if field!==rule.fieldName && field.type!==\\\"layer_image\\\" && field.type!==\\\"magnifier\\\" && field.type!==\\\"advanced_options\\\"}",
    		ctx
    	});

    	return block;
    }

    // (210:14) {#each fields as field}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*field*/ ctx[30] !== /*rule*/ ctx[27].fieldName && /*field*/ ctx[30].type !== "layer_image" && /*field*/ ctx[30].type !== "magnifier" && /*field*/ ctx[30].type !== "advanced_options" && create_if_block_4$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*field*/ ctx[30] !== /*rule*/ ctx[27].fieldName && /*field*/ ctx[30].type !== "layer_image" && /*field*/ ctx[30].type !== "magnifier" && /*field*/ ctx[30].type !== "advanced_options") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(210:14) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (217:10) {#if rule.actionType === 'copyParameter'}
    function create_if_block_3$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function input_input_handler_1() {
    		/*input_input_handler_1*/ ctx[20].call(input, /*each_value*/ ctx[28], /*index*/ ctx[29]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "oneLine input svelte-14rkto5");
    			add_location(input, file$2, 217, 11, 7986);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*rule*/ ctx[27].targetParameter);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler_1);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44 && input.value !== /*rule*/ ctx[27].targetParameter) {
    				set_input_value(input, /*rule*/ ctx[27].targetParameter);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(217:10) {#if rule.actionType === 'copyParameter'}",
    		ctx
    	});

    	return block;
    }

    // (123:2) {#each rules as rule, index}
    function create_each_block$2(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*editingIndex*/ ctx[1] === /*index*/ ctx[29]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "rule-row svelte-14rkto5");
    			add_location(div, file$2, 123, 4, 3416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(123:2) {#each rules as rule, index}",
    		ctx
    	});

    	return block;
    }

    // (244:2) {#if !no_edit}
    function create_if_block$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Add Rule";
    			attr_dev(button, "class", "svelte-14rkto5");
    			add_location(button, file$2, 244, 6, 9255);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addRule*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(244:2) {#if !no_edit}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let t2;
    	let current;
    	let each_value = /*rules*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = !/*no_edit*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Rules";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "class", "svelte-14rkto5");
    			add_location(h1, file$2, 120, 2, 3362);
    			attr_dev(div, "class", "ruleEditor svelte-14rkto5");
    			add_location(div, file$2, 119, 1, 3334);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			append_dev(div, t2);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*cloneRule, deleteRule, rules, fields, mappingFields, conditions, editingIndex, editRule, no_edit*/ 959) {
    				each_value = /*rules*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!/*no_edit*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(24, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RuleEditor', slots, []);
    	let { no_edit = false } = $$props;
    	let mH = new mappingsHelper();
    	let MappingsCopmponent;
    	let conditions = ['==', '!=', '>', '<', '>=', '<='];
    	let editingIndex = null; // Index of the currently editing rule
    	if (!$metadata.rules) set_store_value(metadata, $metadata.rules = [], $metadata);
    	let fields = $metadata.forms.default.elements; // get form fields
    	let rules = $metadata.rules;
    	let mappingFields = { defaultfields: [] };

    	function addRule() {
    		rules.push({
    			fieldName: '',
    			condition: '',
    			actionType: '',
    			rightValue: '',
    			targetField: '',
    			actionValue: ''
    		});

    		$$invalidate(2, rules);
    		$$invalidate(1, editingIndex = rules.length - 1);
    		set_store_value(metadata, $metadata.rules = rules, $metadata);
    	}

    	onMount(() => {
    		$$invalidate(3, mappingFields = mH.getMappingFields($metadata));
    	});

    	function deleteRule(index) {
    		rules.splice(index, 1);

    		if (editingIndex === index) {
    			$$invalidate(1, editingIndex = null); // Reset editing index if the currently edited rule is deleted
    		}

    		$$invalidate(2, rules);
    		set_store_value(metadata, $metadata.rules = rules, $metadata);
    	}

    	function cloneRule(index) {
    		let rule = rules[index];
    		rule = JSON.parse(JSON.stringify(rule));
    		rules.push(rule);
    		$$invalidate(1, editingIndex = rules.length - 1);
    		set_store_value(metadata, $metadata.rules = rules, $metadata);
    	}

    	function editRule(index) {
    		$$invalidate(1, editingIndex = index);
    	}

    	const writable_props = ['no_edit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RuleEditor> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, editingIndex = -1);
    	};

    	function select0_change_handler(each_value, index) {
    		each_value[index].fieldName = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function select1_change_handler(each_value, index) {
    		each_value[index].condition = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function input_input_handler(each_value, index) {
    		each_value[index].rightValue = this.value;
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function select2_change_handler(each_value, index) {
    		each_value[index].actionType = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function select_change_handler(each_value, index) {
    		each_value[index].targetField = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function inputcombo_value_binding(value, rule) {
    		if ($$self.$$.not_equal(rule.actionValue, value)) {
    			rule.actionValue = value;
    			$$invalidate(2, rules);
    		}
    	}

    	function select_change_handler_1(each_value, index) {
    		each_value[index].targetField = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function select0_change_handler_1(each_value, index) {
    		each_value[index].actionValue = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function select1_change_handler_1(each_value, index) {
    		each_value[index].targetField = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function input_input_handler_1(each_value, index) {
    		each_value[index].targetParameter = this.value;
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	const click_handler_1 = index => deleteRule(index);
    	const click_handler_2 = index => cloneRule(index);
    	const click_handler_3 = index => editRule(index);

    	$$self.$$set = $$props => {
    		if ('no_edit' in $$props) $$invalidate(0, no_edit = $$props.no_edit);
    	};

    	$$self.$capture_state = () => ({
    		metadata,
    		InputCombo,
    		onMount,
    		mappingsHelper,
    		no_edit,
    		mH,
    		MappingsCopmponent,
    		conditions,
    		editingIndex,
    		fields,
    		rules,
    		mappingFields,
    		addRule,
    		deleteRule,
    		cloneRule,
    		editRule,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('no_edit' in $$props) $$invalidate(0, no_edit = $$props.no_edit);
    		if ('mH' in $$props) mH = $$props.mH;
    		if ('MappingsCopmponent' in $$props) MappingsCopmponent = $$props.MappingsCopmponent;
    		if ('conditions' in $$props) $$invalidate(4, conditions = $$props.conditions);
    		if ('editingIndex' in $$props) $$invalidate(1, editingIndex = $$props.editingIndex);
    		if ('fields' in $$props) $$invalidate(5, fields = $$props.fields);
    		if ('rules' in $$props) $$invalidate(2, rules = $$props.rules);
    		if ('mappingFields' in $$props) $$invalidate(3, mappingFields = $$props.mappingFields);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		no_edit,
    		editingIndex,
    		rules,
    		mappingFields,
    		conditions,
    		fields,
    		addRule,
    		deleteRule,
    		cloneRule,
    		editRule,
    		click_handler,
    		select0_change_handler,
    		select1_change_handler,
    		input_input_handler,
    		select2_change_handler,
    		select_change_handler,
    		inputcombo_value_binding,
    		select_change_handler_1,
    		select0_change_handler_1,
    		select1_change_handler_1,
    		input_input_handler_1,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class RuleEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { no_edit: 0 }, add_css$3, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RuleEditor",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get no_edit() {
    		throw new Error("<RuleEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set no_edit(value) {
    		throw new Error("<RuleEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Mappings.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\Mappings.svelte";

    function add_css$2(target) {
    	append_styles(target, "svelte-mlofvx", "#gyre_mappings.svelte-mlofvx .mapping.svelte-mlofvx{border:1px solid white;margin-top:10px;padding:5px;position:relative}#gyre_mappings.svelte-mlofvx .mapping .del.svelte-mlofvx{position:absolute;right:10px;top:2px}#gyre_mappings.svelte-mlofvx button.svelte-mlofvx{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}#gyre_mappings.svelte-mlofvx.svelte-mlofvx{z-index:200;position:fixed;left:10px;top:10px;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:20px;backdrop-filter:blur(20px) brightness(80%);box-shadow:0 0 1rem 0 rgba(255, 255, 255, 0.2);color:white;width:540px;display:block;border-radius:10px;font-size:14px}#gyre_mappings.svelte-mlofvx.svelte-mlofvx{display:none;width:480px;left:200px;top:200px}#gyre_mappings.svelte-mlofvx select.svelte-mlofvx{background-color:grey;font-size:14px;color:white;border:none;margin-top:10px;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}#gyre_mappings.svelte-mlofvx select.svelte-mlofvx{background:transparent;border:1px solid white;border-radius:5px}#gyre_mappings.svelte-mlofvx select option.svelte-mlofvx,#gyre_mappings.svelte-mlofvx select optgroup.svelte-mlofvx{background:black}#gyre_mappings.svelte-mlofvx h1.svelte-mlofvx{font-size:16px;margin-top:5px;margin-bottom:30px}#gyre_mappings.svelte-mlofvx .close.svelte-mlofvx{position:absolute;right:20px;top:20px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwcGluZ3Muc3ZlbHRlIiwic291cmNlcyI6WyJNYXBwaW5ncy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAgIGltcG9ydCB7IG1ldGFkYXRhfSBmcm9tICcuL3N0b3Jlcy9tZXRhZGF0YSdcclxuICAgIGltcG9ydCBJY29uIGZyb20gJy4vSWNvbi5zdmVsdGUnXHJcbiAgICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnO1xyXG4gICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyPXRydWVcclxuICAgIGltcG9ydCB7IG1hcHBpbmdzSGVscGVyIH0gZnJvbSAnLi9tYXBwaW5nc0hlbHBlci5qcydcclxuXHJcbiAgICBsZXQgc2hvd0d5cmVNYXBwaW5ncz1cIm5vbmVcIlxyXG4gICAgbGV0IGd5cmVNYXBwaW5nc0RpYWxvZ0xlZnQ9XCIxMDBweFwiXHJcbiAgICBsZXQgZ3lyZU1hcHBpbmdzRGlhbG9nVG9wPVwiMTAwcHhcIlxyXG4gICAgbGV0IHdpZGdldHM9W11cclxuICAgIGxldCBub2RlVHlwZT1cIlwiXHJcbiAgICBsZXQgbUg9bmV3IG1hcHBpbmdzSGVscGVyKClcclxuICAgIGxldCBtYXBwaW5nRmllbGRzPW1ILmdldE1hcHBpbmdGaWVsZHMoJG1ldGFkYXRhKVxyXG4gICAgbGV0IG5vZGVJZD0wXHJcbiAgICBmdW5jdGlvbiBvcGVuR3lyZU1hcHBpbmdzKG5vZGUsZSkge1xyXG4gICAgICAgIG1hcHBpbmdGaWVsZHM9bUguZ2V0TWFwcGluZ0ZpZWxkcygkbWV0YWRhdGEpXHJcbiAgICAgICAgc2hvd0d5cmVNYXBwaW5ncz1cImJsb2NrXCJcclxuICAgICAgICBub2RlSWQ9bm9kZS5pZFxyXG4gICAgICAgIGxldCB4PWUuY2xpZW50WC00ODAvMlxyXG4gICAgICAgIGxldCB5PWUuY2xpZW50WS0yMDBcclxuICAgICAgICBpZiAoeDwwKSB4PTBcclxuICAgICAgICBpZiAoeTwwKSB5PTBcclxuICAgICAgICBpZiAoeCs0ODA+d2luZG93LmlubmVyV2lkdGgpIHg9d2luZG93LmlubmVyV2lkdGgtNTQwXHJcbiAgICAgICAgaWYgKHkrNDAwPndpbmRvdy5pbm5lckhlaWdodCkgeT13aW5kb3cuaW5uZXJIZWlnaHQtNDAwXHJcblxyXG4gICAgICAgIGd5cmVNYXBwaW5nc0RpYWxvZ0xlZnQ9eCtcInB4XCJcclxuICAgICAgICBneXJlTWFwcGluZ3NEaWFsb2dUb3A9eStcInB4XCJcclxuICAgICAgICBcclxuICAgICAgICB3aWRnZXRzPW5vZGUud2lkZ2V0c1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiV1wiLHdpZGdldHMpXHJcbiAgICAgICAgbm9kZVR5cGU9bm9kZS50eXBlXHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEubWFwcGluZ3MpICRtZXRhZGF0YS5tYXBwaW5ncz17fVxyXG4gICAgICAgIG1hcHBpbmdzPSRtZXRhZGF0YS5tYXBwaW5nc1tub2RlSWRdXHJcbiAgICAgICAgaWYgKCFtYXBwaW5ncykgbWFwcGluZ3M9W11cclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cub3Blbkd5cmVNYXBwaW5ncz1vcGVuR3lyZU1hcHBpbmdzICAgIC8vIGV4cG9zZSBvcGVuIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBDb21meVVJIG1lbnUgZXh0ZW5zaW9uXHJcblxyXG4gICAgLy8gY2hlY2sgb2YgYSB3aWRnZXQgKD1hIG5vZGUgcHJvcGVydHkpIGlzIGNvbm5lY3RlZCB0byBhIGZvcm0gZmllbGRcclxuICAgIGZ1bmN0aW9uIGNoZWNrR3lyZU1hcHBpbmcobm9kZSx3aWRnZXQsaW5kZXgpIHtcclxuICAgICAgICBpZiAgKCEkbWV0YWRhdGEubWFwcGluZ3MpIHJldHVyblxyXG4gICAgICAgIGlmICghJG1ldGFkYXRhLm1hcHBpbmdzW25vZGUuaWRdKSByZXR1cm5cclxuICAgICAgICBmb3IobGV0IGk9MDtpPCRtZXRhZGF0YS5tYXBwaW5nc1tub2RlLmlkXS5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBtYXBwaW5nPSRtZXRhZGF0YS5tYXBwaW5nc1tub2RlLmlkXVtpXVxyXG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwibmFtZVwiLHdpZGdldC5uYW1lLGluZGV4KVxyXG4gICAgICAgICAgICBpZiAobWFwcGluZy50b0ZpZWxkPT09d2lkZ2V0Lm5hbWUpIHsgXHJcbiAgICAgICAgICAgICAgICBtYXBwaW5nLnRvSW5kZXg9aW5kZXhcclxuICAgICAgICAgICAgICAgIGxldCBsYWJlbD0od2lkZ2V0LmxhYmVsIHx8IHdpZGdldC5uYW1lKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsK1wiPVwiK21hcHBpbmcuZnJvbUZpZWxkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB3aW5kb3cuY2hlY2tHeXJlTWFwcGluZz1jaGVja0d5cmVNYXBwaW5nXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGd5cmVDbGVhckFsbENvbWJvVmFsdWVzKCkge1xyXG4gICAgICAgICRtZXRhZGF0YS5jb21ib192YWx1ZXMgPSB7fVxyXG4gICAgICAgICRtZXRhZGF0YS5zZWxlY3RlZF9jb21ib192YWx1ZXM9W11cclxuICAgIH1cclxuICAgIHdpbmRvdy5neXJlQ2xlYXJBbGxDb21ib1ZhbHVlcz1neXJlQ2xlYXJBbGxDb21ib1ZhbHVlc1xyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlRGlhbG9nKCkge1xyXG4gICAgICAgIHNob3dHeXJlTWFwcGluZ3M9XCJub25lXCJcclxuICAgIH1cclxuXHJcblxyXG4gICAgbGV0IG1hcHBpbmdzID0gW11cclxuICAgIGxldCBmcm9tRmllbGQ9XCJcIlxyXG4gICAgbGV0IHRvRmllbGQ9XCJcIlxyXG4gICAgbGV0IGFkZEZpZWxkPVwiXCJcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRNYXBwaW5nKCkge1xyXG4gICAgICAgIGlmICghdG9GaWVsZCB8fCAhZnJvbUZpZWxkKSByZXR1cm5cclxuICAgICAgICBpZiAoIW5vZGVJZCkgcmV0dXJuXHJcbiAgICAgICAgbWFwcGluZ3MucHVzaCh7IGZyb21GaWVsZCx0b0ZpZWxkICB9KVxyXG4gICAgICAgIG1hcHBpbmdzPW1hcHBpbmdzXHJcbiAgICAgICAgJG1ldGFkYXRhLm1hcHBpbmdzW25vZGVJZF0gPSBtYXBwaW5nc1xyXG4gICAgICAgIGZyb21GaWVsZD10b0ZpZWxkPWFkZEZpZWxkPVwiXCJcclxuICAgIH0gICAgXHJcblxyXG4gICAgZnVuY3Rpb24gYWRkRm9ybUZpZWxkKGZpZWxkTmFtZSkge1xyXG4gICAgICAgIGlmICghbm9kZUlkKSByZXR1cm5cclxuICAgICAgICBpZiAoIWZpZWxkTmFtZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKGNoZWNrSWZGaWVsZE5hbWVFeGlzdHMoZmllbGROYW1lKSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IHdpZGdldD1nZXRXaWRnZXQoZmllbGROYW1lKVxyXG4gICAgICAgIGlmICghd2lkZ2V0KSByZXR1cm5cclxuICAgICAgICBsZXQgdHlwZT13aWRnZXQudHlwZVxyXG4gICAgICAgIGxldCBsYWJlbD1maWVsZE5hbWVcclxuICAgICAgICBsYWJlbD1sYWJlbC5yZXBsYWNlKC9fL2csIFwiIFwiKTtcclxuICAgICAgICBsYWJlbD1sYWJlbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGxhYmVsLnNsaWNlKDEpXHJcbiAgICAgICAgbGV0IGZpZWxkPXtuYW1lOmZpZWxkTmFtZSxsYWJlbCxkZWZhdWx0OndpZGdldC52YWx1ZX1cclxuICAgICAgICBpZiAodHlwZT09PVwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgZmllbGQudHlwZT1cInNsaWRlclwiXHJcbiAgICAgICAgICAgIGlmICh3aWRnZXQub3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgZmllbGQubWluPXdpZGdldC5vcHRpb25zLm1pblxyXG4gICAgICAgICAgICAgICAgZmllbGQubWF4PXdpZGdldC5vcHRpb25zLm1heFxyXG4gICAgICAgICAgICAgICAgZmllbGQuc3RlcD13aWRnZXQub3B0aW9ucy5yb3VuZCAgICAgICBcclxuICAgICAgICAgICAgICAgLy8gZmllbGQuZGVmYXVsdD1maWVsZC5taW4gICAgICAgICBcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZT09PVwiY3VzdG9tdGV4dFwiKSB7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGU9XCJ0ZXh0YXJlYVwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlPT09XCJ0ZXh0XCIpIHtcclxuICAgICAgICAgICAgZmllbGQudHlwZT1cInRleHRcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZT09PVwiY29tYm9cIikge1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlPVwicHJlX2ZpbGxlZF9kcm9wZG93blwiXHJcbiAgICAgICAgICAgIGZpZWxkLndpZGdldF9uYW1lPWZpZWxkTmFtZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZT09PVwidG9nZ2xlXCIpIHtcclxuICAgICAgICAgICAgZmllbGQudHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgICAgLy8gICBmaWVsZC5kZWZhdWx0PVwiZmFsc2VcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWZpZWxkLnR5cGUpIHJldHVyblxyXG4gICAgXHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEuZm9ybXMpICRtZXRhZGF0YS5mb3Jtcz17fVxyXG4gICAgICAgIGlmICghJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQpICRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0PXt9XHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50cykgJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQuZWxlbWVudHM9W11cclxuICAgICAgICBsZXQgZm9ybUZpZWxkcz0kbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50c1xyXG4gICAgICAgIGZvcm1GaWVsZHMucHVzaChmaWVsZClcclxuICAgICAgICBtYXBwaW5ncy5wdXNoKHsgZnJvbUZpZWxkOmZpZWxkTmFtZSx0b0ZpZWxkOmZpZWxkTmFtZSAgfSlcclxuICAgICAgICBtYXBwaW5ncz1tYXBwaW5nc1xyXG4gICAgICAgICRtZXRhZGF0YS5tYXBwaW5nc1tub2RlSWRdID0gbWFwcGluZ3NcclxuICAgICAgICBmcm9tRmllbGQ9dG9GaWVsZD1hZGRGaWVsZD1cIlwiXHJcbiAgICAgIC8vIFxyXG4gICAgfSAgIFxyXG4gICAgZnVuY3Rpb24gZ2V0V2lkZ2V0KGZpZWxkTmFtZSkge1xyXG4gICAgICAgIGlmICghd2lkZ2V0cykgcmV0dXJuXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx3aWRnZXRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgbGV0IHdpZGdldD13aWRnZXRzW2ldXHJcbiAgICAgICAgICAgIGlmICh3aWRnZXQubmFtZT09PWZpZWxkTmFtZSkgcmV0dXJuIHdpZGdldFxyXG4gICAgICAgIH0gICAgXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBkZWxldGVNYXBwaW5nKGluZGV4KSB7XHJcbiAgICAgICAgbWFwcGluZ3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICBtYXBwaW5ncz1tYXBwaW5nc1xyXG4gICAgICAgICRtZXRhZGF0YS5tYXBwaW5nc1tub2RlSWRdID0gbWFwcGluZ3NcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNoZWNrSWZGaWVsZE5hbWVFeGlzdHMobmFtZSkge1xyXG4gICAgICAgIGlmICghJG1ldGFkYXRhLmZvcm1zKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoISRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0KSByZXR1cm4gZmFsc2VcclxuICAgICAgICBsZXQgZm9ybUZpZWxkcz0kbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50c1xyXG4gICAgICAgIGlmICghZm9ybUZpZWxkcykgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxmb3JtRmllbGRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgbGV0IGZpZWxkPWZvcm1GaWVsZHNbaV1cclxuICAgICAgICAgICAgaWYgKGZpZWxkLm5hbWU9PT1uYW1lKSByZXR1cm4gdHJ1ZSAgICAgICAgICAgIFxyXG4gICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBhZGRBbGxGb3JtRmllbGRzKCkge1xyXG4gICAgICAgIGlmICghd2lkZ2V0cykgcmV0dXJuXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx3aWRnZXRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgbGV0IHdpZGdldD13aWRnZXRzW2ldXHJcbiAgICAgICAgICAgIGFkZEZvcm1GaWVsZCh3aWRnZXQubmFtZSlcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIGRpc3BhdGNoKFwidXBkYXRlRm9ybVwiLHt9KVxyXG4gICAgfVxyXG48L3NjcmlwdD5cclxueyNpZiByZW5kZXJ9XHJcblxyXG48ZGl2IGlkPVwiZ3lyZV9tYXBwaW5nc1wiIHN0eWxlPVwiZGlzcGxheTp7c2hvd0d5cmVNYXBwaW5nc307bGVmdDp7Z3lyZU1hcHBpbmdzRGlhbG9nTGVmdH07dG9wOntneXJlTWFwcGluZ3NEaWFsb2dUb3B9XCIgPlxyXG4gICAgeyNpZiB3aWRnZXRzICYmIHdpZGdldHMubGVuZ3RofVxyXG5cclxuICAgIDxoMT5GaWVsZCBNYXBwaW5nczwvaDE+XHJcbiAgICAgICAgPGRpdj57bm9kZVR5cGV9PC9kaXY+XHJcblxyXG4gICAgICAgIDxzZWxlY3QgIGJpbmQ6dmFsdWU9e2Zyb21GaWVsZH0+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiRm9ybSBmaWVsZHNcIj5cclxuICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5maWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkRlZmF1bHRzXCI+XHJcbiAgICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5kZWZhdWx0RmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICA8L29wdGdyb3VwPiAgICAgXHJcbiAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIk91dHB1dHNcIj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCBtYXBwaW5nRmllbGRzLm91dHB1dEZpZWxkcyBhcyBmaWVsZH1cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtmaWVsZC5uYW1lfT57ZmllbGQubmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgPC9vcHRncm91cD4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJhcnJvd1JpZ2h0XCI+PC9JY29uPlxyXG4gICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17dG9GaWVsZH0gPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0Li4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsjZWFjaCB3aWRnZXRzIGFzIHdpZGdldH1cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e3dpZGdldC5uYW1lfT57d2lkZ2V0Lm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4ge2FkZE1hcHBpbmcoKX19PisgQWRkPC9idXR0b24+ICBcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4ge2FkZEZvcm1GaWVsZChhZGRGaWVsZCk7ZGlzcGF0Y2goXCJ1cGRhdGVGb3JtXCIse30pfX0+QWRkIGZvcm0gZmllbGQgZnJvbTwvYnV0dG9uPiAgICAgXHJcbiAgICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17YWRkRmllbGR9ID5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCB3aWRnZXRzIGFzIHdpZGdldH1cclxuICAgICAgICAgICAgICAgICAgICB7I2lmICFjaGVja0lmRmllbGROYW1lRXhpc3RzKHdpZGdldC5uYW1lKX1cclxuICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt3aWRnZXQubmFtZX0+e3dpZGdldC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiB7YWRkQWxsRm9ybUZpZWxkcygpfX0+QWRkICBhbGwgZmllbGRzIHRvIGZvcm08L2J1dHRvbj4gICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICB7I2VhY2ggbWFwcGluZ3MgYXMgbWFwcGluZywgaW5kZXh9XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYXBwaW5nXCI+XHJcbiAgICAgICAgICAgICAgICB7bWFwcGluZy5mcm9tRmllbGR9IDxJY29uIG5hbWU9XCJhcnJvd1JpZ2h0XCI+PC9JY29uPnttYXBwaW5nLnRvRmllbGR9XHJcbiAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlbFwiIG9uOmNsaWNrPXsoZSkgPT4ge2RlbGV0ZU1hcHBpbmcoaW5kZXgpfX0+PEljb24gbmFtZT1cInJlbW92ZUZyb21MaXN0XCI+PC9JY29uPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICB7L2VhY2h9XHJcblxyXG57OmVsc2V9ICAgICAgICBcclxuPHAgc3R5bGU9XCJtYXJnaW4tdG9wOjMwcHhcIj5cclxuTm90aGluZyB0byBkbyBoZXJlLiBQbGVhc2Ugc2VsZWN0IG5vZGUgd2l0aCB3aWRnZXRzLiBTbyBmb3IgZXhhbXBsZSB5b3UgY2Fubm90IHNldCBtYXBwaW5ncyBvbiBhIFwiUHJldmlldyBpbWFnZSBub2RlXCIgdXNlIFwiU2F2ZSBpbWFnZVwiIGluc3RlYWQuXHJcbjwvcD5cclxuXHJcbnsvaWZ9XHJcbjxkaXYgY2xhc3M9XCJjbG9zZVwiPjxJY29uIG5hbWU9XCJjbG9zZVwiIG9uOmNsaWNrPXsoZSk9PntjbG9zZURpYWxvZygpfX0+PC9JY29uPjwvZGl2PlxyXG5cclxuPC9kaXY+XHJcblxyXG57L2lmfVxyXG48c3R5bGU+XHJcblxyXG5cclxuI2d5cmVfbWFwcGluZ3MgLm1hcHBpbmcge1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XHJcbiAgICBtYXJnaW4tdG9wOjEwcHg7XHJcbiAgICBwYWRkaW5nOjVweDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG4jZ3lyZV9tYXBwaW5ncyAubWFwcGluZyAuZGVsIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OjEwcHg7XHJcbiAgICB0b3A6IDJweDtcclxufVxyXG5cclxuXHJcblxyXG4jZ3lyZV9tYXBwaW5ncyBidXR0b24ge1xyXG4gICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIG1pbi13aWR0aDogNzBweDtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogcmdiKDEyOCwgMTI4LCAxMjgpO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfVxyXG4jZ3lyZV9tYXBwaW5ncyB7XHJcbiAgICB6LWluZGV4OiAyMDA7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICBsZWZ0OiAxMHB4O1xyXG4gICAgdG9wOiAxMHB4O1xyXG4gICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDIwcHgpIGJyaWdodG5lc3MoODAlKTtcclxuICAgIGJveC1zaGFkb3c6IDAgMCAxcmVtIDAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgd2lkdGg6IDU0MHB4O1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG59XHJcbiNneXJlX21hcHBpbmdzIHtcclxuICAgIGRpc3BsYXk6bm9uZTtcclxuICAgIHdpZHRoOjQ4MHB4O1xyXG4gICAgbGVmdDoyMDBweDtcclxuICAgIHRvcDoyMDBweDtcclxufVxyXG4jZ3lyZV9tYXBwaW5ncyBzZWxlY3Qge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JleTtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgIHBhZGRpbmc6IDNweDtcclxufVxyXG4jZ3lyZV9tYXBwaW5ncyBzZWxlY3Qge1xyXG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxufVxyXG4jZ3lyZV9tYXBwaW5ncyBzZWxlY3Qgb3B0aW9uLCNneXJlX21hcHBpbmdzIHNlbGVjdCBvcHRncm91cCB7XHJcbiAgICBiYWNrZ3JvdW5kOiBibGFjaztcclxufVxyXG4jZ3lyZV9tYXBwaW5ncyBoMSB7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBtYXJnaW4tdG9wOiA1cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG59XHJcbiNneXJlX21hcHBpbmdzIC5jbG9zZSB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDogMjBweDtcclxuICAgIHRvcDoyMHB4O1xyXG59XHJcbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXlPQSw0QkFBYyxDQUFDLHNCQUFTLENBQ3BCLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FDdkIsV0FBVyxJQUFJLENBQ2YsUUFBUSxHQUFHLENBQ1gsUUFBUSxDQUFFLFFBQ2QsQ0FDQSw0QkFBYyxDQUFDLFFBQVEsQ0FBQyxrQkFBSyxDQUN6QixRQUFRLENBQUUsUUFBUSxDQUNsQixNQUFNLElBQUksQ0FDVixHQUFHLENBQUUsR0FDVCxDQUlBLDRCQUFjLENBQUMsb0JBQU8sQ0FDbEIsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDL0gsU0FBUyxDQUFFLElBQUksQ0FDZixTQUFTLENBQUUsSUFBSSxDQUNmLEtBQUssQ0FBRSxLQUFLLENBQ1osZ0JBQWdCLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDcEMsWUFBWSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ2hDLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsWUFBWSxDQUFFLElBQ2xCLENBQ0osMENBQWUsQ0FDWCxPQUFPLENBQUUsR0FBRyxDQUNaLFFBQVEsQ0FBRSxLQUFLLENBQ2YsSUFBSSxDQUFFLElBQUksQ0FDVixHQUFHLENBQUUsSUFBSSxDQUNULFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLE9BQU8sQ0FBRSxJQUFJLENBQ2IsZUFBZSxDQUFFLEtBQUssSUFBSSxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FDM0MsVUFBVSxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUMvQyxLQUFLLENBQUUsS0FBSyxDQUNaLEtBQUssQ0FBRSxLQUFLLENBQ1osT0FBTyxDQUFFLEtBQUssQ0FDZCxhQUFhLENBQUUsSUFBSSxDQUNuQixTQUFTLENBQUUsSUFDZixDQUNBLDBDQUFlLENBQ1gsUUFBUSxJQUFJLENBQ1osTUFBTSxLQUFLLENBQ1gsS0FBSyxLQUFLLENBQ1YsSUFBSSxLQUNSLENBQ0EsNEJBQWMsQ0FBQyxvQkFBTyxDQUNsQixnQkFBZ0IsQ0FBRSxJQUFJLENBQ3RCLFNBQVMsQ0FBRSxJQUFJLENBQ2YsS0FBSyxDQUFFLEtBQUssQ0FDWixNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLE9BQU8sQ0FBRSxHQUNiLENBQ0EsNEJBQWMsQ0FBQyxvQkFBTyxDQUNsQixVQUFVLENBQUUsV0FBVyxDQUN2QixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQ3ZCLGFBQWEsQ0FBRSxHQUNuQixDQUNBLDRCQUFjLENBQUMsTUFBTSxDQUFDLG9CQUFNLENBQUMsNEJBQWMsQ0FBQyxNQUFNLENBQUMsc0JBQVMsQ0FDeEQsVUFBVSxDQUFFLEtBQ2hCLENBQ0EsNEJBQWMsQ0FBQyxnQkFBRyxDQUNkLFNBQVMsQ0FBRSxJQUFJLENBQ2YsVUFBVSxDQUFFLEdBQUcsQ0FDZixhQUFhLENBQUUsSUFDbkIsQ0FDQSw0QkFBYyxDQUFDLG9CQUFPLENBQ2xCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEtBQUssQ0FBRSxJQUFJLENBQ1gsSUFBSSxJQUNSIn0= */");
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	child_ctx[35] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    function get_each_context_5$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    // (163:0) {#if render}
    function create_if_block$1(ctx) {
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let div0;
    	let icon;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*widgets*/ ctx[4] && /*widgets*/ ctx[4].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	icon = new Icon({ props: { name: "close" }, $$inline: true });
    	icon.$on("click", /*click_handler_4*/ ctx[25]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if_block.c();
    			t = space();
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div0, "class", "close svelte-mlofvx");
    			add_location(div0, file$1, 225, 0, 8072);
    			attr_dev(div1, "id", "gyre_mappings");
    			set_style(div1, "display", /*showGyreMappings*/ ctx[1]);
    			set_style(div1, "left", /*gyreMappingsDialogLeft*/ ctx[2]);
    			set_style(div1, "top", /*gyreMappingsDialogTop*/ ctx[3]);
    			attr_dev(div1, "class", "svelte-mlofvx");
    			add_location(div1, file$1, 164, 0, 5472);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(icon, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, t);
    			}

    			if (!current || dirty[0] & /*showGyreMappings*/ 2) {
    				set_style(div1, "display", /*showGyreMappings*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*gyreMappingsDialogLeft*/ 4) {
    				set_style(div1, "left", /*gyreMappingsDialogLeft*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*gyreMappingsDialogTop*/ 8) {
    				set_style(div1, "top", /*gyreMappingsDialogTop*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(163:0) {#if render}",
    		ctx
    	});

    	return block;
    }

    // (220:0) {:else}
    function create_else_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Nothing to do here. Please select node with widgets. So for example you cannot set mappings on a \"Preview image node\" use \"Save image\" instead.";
    			set_style(p, "margin-top", "30px");
    			add_location(p, file$1, 220, 0, 7883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(220:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (166:4) {#if widgets && widgets.length}
    function create_if_block_1$1(ctx) {
    	let h1;
    	let t1;
    	let div0;
    	let t2;
    	let t3;
    	let select0;
    	let option0;
    	let optgroup0;
    	let optgroup1;
    	let optgroup2;
    	let t5;
    	let icon;
    	let t6;
    	let select1;
    	let option1;
    	let t8;
    	let button0;
    	let t10;
    	let div1;
    	let button1;
    	let t12;
    	let select2;
    	let option2;
    	let t14;
    	let div2;
    	let button2;
    	let t16;
    	let each5_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_5 = /*mappingFields*/ ctx[6].fields;
    	validate_each_argument(each_value_5);
    	let each_blocks_5 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_5[i] = create_each_block_5$1(get_each_context_5$1(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*mappingFields*/ ctx[6].defaultFields;
    	validate_each_argument(each_value_4);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_4[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*mappingFields*/ ctx[6].outputFields;
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	icon = new Icon({
    			props: { name: "arrowRight" },
    			$$inline: true
    		});

    	let each_value_2 = /*widgets*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*widgets*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*mappings*/ ctx[7];
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
    			h1 = element("h1");
    			h1.textContent = "Field Mappings";
    			t1 = space();
    			div0 = element("div");
    			t2 = text(/*nodeType*/ ctx[5]);
    			t3 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Select...";
    			optgroup0 = element("optgroup");

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].c();
    			}

    			optgroup1 = element("optgroup");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			optgroup2 = element("optgroup");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t5 = space();
    			create_component(icon.$$.fragment);
    			t6 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Select...";

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t8 = space();
    			button0 = element("button");
    			button0.textContent = "+ Add";
    			t10 = space();
    			div1 = element("div");
    			button1 = element("button");
    			button1.textContent = "Add form field from";
    			t12 = space();
    			select2 = element("select");
    			option2 = element("option");
    			option2.textContent = "Select...";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t14 = space();
    			div2 = element("div");
    			button2 = element("button");
    			button2.textContent = "Add  all fields to form";
    			t16 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each5_anchor = empty();
    			attr_dev(h1, "class", "svelte-mlofvx");
    			add_location(h1, file$1, 167, 4, 5635);
    			add_location(div0, file$1, 168, 8, 5668);
    			option0.__value = "";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-mlofvx");
    			add_location(option0, file$1, 171, 12, 5747);
    			attr_dev(optgroup0, "label", "Form fields");
    			attr_dev(optgroup0, "class", "svelte-mlofvx");
    			add_location(optgroup0, file$1, 172, 12, 5796);
    			attr_dev(optgroup1, "label", "Defaults");
    			attr_dev(optgroup1, "class", "svelte-mlofvx");
    			add_location(optgroup1, file$1, 177, 9, 6010);
    			attr_dev(optgroup2, "label", "Outputs");
    			attr_dev(optgroup2, "class", "svelte-mlofvx");
    			add_location(optgroup2, file$1, 182, 12, 6238);
    			attr_dev(select0, "class", "svelte-mlofvx");
    			if (/*fromField*/ ctx[8] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[18].call(select0));
    			add_location(select0, file$1, 170, 8, 5701);
    			option1.__value = "";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-mlofvx");
    			add_location(option1, file$1, 190, 12, 6579);
    			attr_dev(select1, "class", "svelte-mlofvx");
    			if (/*toField*/ ctx[9] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[19].call(select1));
    			add_location(select1, file$1, 189, 8, 6535);
    			attr_dev(button0, "class", "svelte-mlofvx");
    			add_location(button0, file$1, 195, 8, 6771);
    			attr_dev(button1, "class", "svelte-mlofvx");
    			add_location(button1, file$1, 197, 12, 6857);
    			option2.__value = "";
    			option2.value = option2.__value;
    			attr_dev(option2, "class", "svelte-mlofvx");
    			add_location(option2, file$1, 199, 16, 7030);
    			attr_dev(select2, "class", "svelte-mlofvx");
    			if (/*addField*/ ctx[10] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[22].call(select2));
    			add_location(select2, file$1, 198, 12, 6981);
    			add_location(div1, file$1, 196, 8, 6838);
    			attr_dev(button2, "class", "svelte-mlofvx");
    			add_location(button2, file$1, 208, 12, 7367);
    			add_location(div2, file$1, 207, 8, 7348);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, select0, anchor);
    			append_dev(select0, option0);
    			append_dev(select0, optgroup0);

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				if (each_blocks_5[i]) {
    					each_blocks_5[i].m(optgroup0, null);
    				}
    			}

    			append_dev(select0, optgroup1);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				if (each_blocks_4[i]) {
    					each_blocks_4[i].m(optgroup1, null);
    				}
    			}

    			append_dev(select0, optgroup2);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				if (each_blocks_3[i]) {
    					each_blocks_3[i].m(optgroup2, null);
    				}
    			}

    			select_option(select0, /*fromField*/ ctx[8], true);
    			insert_dev(target, t5, anchor);
    			mount_component(icon, target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, select1, anchor);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(select1, null);
    				}
    			}

    			select_option(select1, /*toField*/ ctx[9], true);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button1);
    			append_dev(div1, t12);
    			append_dev(div1, select2);
    			append_dev(select2, option2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(select2, null);
    				}
    			}

    			select_option(select2, /*addField*/ ctx[10], true);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button2);
    			insert_dev(target, t16, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each5_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[18]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[19]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[20], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[21], false, false, false, false),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[22]),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[23], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*nodeType*/ 32) set_data_dev(t2, /*nodeType*/ ctx[5]);

    			if (dirty[0] & /*mappingFields*/ 64) {
    				each_value_5 = /*mappingFields*/ ctx[6].fields;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5$1(ctx, each_value_5, i);

    					if (each_blocks_5[i]) {
    						each_blocks_5[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_5[i] = create_each_block_5$1(child_ctx);
    						each_blocks_5[i].c();
    						each_blocks_5[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_5.length; i += 1) {
    					each_blocks_5[i].d(1);
    				}

    				each_blocks_5.length = each_value_5.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 64) {
    				each_value_4 = /*mappingFields*/ ctx[6].defaultFields;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_4$1(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_4.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 64) {
    				each_value_3 = /*mappingFields*/ ctx[6].outputFields;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3$1(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(optgroup2, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty[0] & /*fromField, mappingFields*/ 320) {
    				select_option(select0, /*fromField*/ ctx[8]);
    			}

    			if (dirty[0] & /*widgets*/ 16) {
    				each_value_2 = /*widgets*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*toField, widgets*/ 528) {
    				select_option(select1, /*toField*/ ctx[9]);
    			}

    			if (dirty[0] & /*widgets, checkIfFieldNameExists*/ 65552) {
    				each_value_1 = /*widgets*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*addField, widgets*/ 1040) {
    				select_option(select2, /*addField*/ ctx[10]);
    			}

    			if (dirty[0] & /*deleteMapping, mappings*/ 32896) {
    				each_value = /*mappings*/ ctx[7];
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
    						each_blocks[i].m(each5_anchor.parentNode, each5_anchor);
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
    			transition_in(icon.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(select0);
    			destroy_each(each_blocks_5, detaching);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(icon, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(select1);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t16);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each5_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(166:4) {#if widgets && widgets.length}",
    		ctx
    	});

    	return block;
    }

    // (174:14) {#each mappingFields.fields as field}
    function create_each_block_5$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[41].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[41].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 174, 20, 5901);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 64 && t_value !== (t_value = /*field*/ ctx[41].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 64 && option_value_value !== (option_value_value = /*field*/ ctx[41].name)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5$1.name,
    		type: "each",
    		source: "(174:14) {#each mappingFields.fields as field}",
    		ctx
    	});

    	return block;
    }

    // (179:16) {#each mappingFields.defaultFields as field}
    function create_each_block_4$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[41].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[41].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 179, 20, 6121);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 64 && t_value !== (t_value = /*field*/ ctx[41].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 64 && option_value_value !== (option_value_value = /*field*/ ctx[41].name)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(179:16) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (184:16) {#each mappingFields.outputFields as field}
    function create_each_block_3$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[41].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[41].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 184, 20, 6347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 64 && t_value !== (t_value = /*field*/ ctx[41].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 64 && option_value_value !== (option_value_value = /*field*/ ctx[41].name)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(184:16) {#each mappingFields.outputFields as field}",
    		ctx
    	});

    	return block;
    }

    // (192:12) {#each widgets as widget}
    function create_each_block_2$1(ctx) {
    	let option;
    	let t_value = /*widget*/ ctx[36].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*widget*/ ctx[36].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 192, 16, 6671);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*widgets*/ 16 && t_value !== (t_value = /*widget*/ ctx[36].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*widgets*/ 16 && option_value_value !== (option_value_value = /*widget*/ ctx[36].name)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(192:12) {#each widgets as widget}",
    		ctx
    	});

    	return block;
    }

    // (202:20) {#if !checkIfFieldNameExists(widget.name)}
    function create_if_block_2$1(ctx) {
    	let option;
    	let t_value = /*widget*/ ctx[36].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*widget*/ ctx[36].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 202, 23, 7197);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*widgets*/ 16 && t_value !== (t_value = /*widget*/ ctx[36].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*widgets*/ 16 && option_value_value !== (option_value_value = /*widget*/ ctx[36].name)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(202:20) {#if !checkIfFieldNameExists(widget.name)}",
    		ctx
    	});

    	return block;
    }

    // (201:16) {#each widgets as widget}
    function create_each_block_1$1(ctx) {
    	let show_if = !/*checkIfFieldNameExists*/ ctx[16](/*widget*/ ctx[36].name);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*widgets*/ 16) show_if = !/*checkIfFieldNameExists*/ ctx[16](/*widget*/ ctx[36].name);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(201:16) {#each widgets as widget}",
    		ctx
    	});

    	return block;
    }

    // (212:8) {#each mappings as mapping, index}
    function create_each_block$1(ctx) {
    	let div1;
    	let t0_value = /*mapping*/ ctx[33].fromField + "";
    	let t0;
    	let t1;
    	let icon0;
    	let t2_value = /*mapping*/ ctx[33].toField + "";
    	let t2;
    	let t3;
    	let div0;
    	let icon1;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { name: "arrowRight" },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { name: "removeFromList" },
    			$$inline: true
    		});

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[24](/*index*/ ctx[35], ...args);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(icon0.$$.fragment);
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			create_component(icon1.$$.fragment);
    			t4 = space();
    			attr_dev(div0, "class", "del svelte-mlofvx");
    			add_location(div0, file$1, 215, 16, 7726);
    			attr_dev(div1, "class", "mapping svelte-mlofvx");
    			add_location(div1, file$1, 212, 12, 7527);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			mount_component(icon0, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			mount_component(icon1, div0, null);
    			append_dev(div1, t4);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", click_handler_3, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*mappings*/ 128) && t0_value !== (t0_value = /*mapping*/ ctx[33].fromField + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*mappings*/ 128) && t2_value !== (t2_value = /*mapping*/ ctx[33].toField + "")) set_data_dev(t2, t2_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(212:8) {#each mappings as mapping, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*render*/ ctx[0] && create_if_block$1(ctx);

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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*render*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*render*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
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
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(27, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mappings', slots, []);
    	const dispatch = createEventDispatcher();
    	let { render = true } = $$props;
    	let showGyreMappings = "none";
    	let gyreMappingsDialogLeft = "100px";
    	let gyreMappingsDialogTop = "100px";
    	let widgets = [];
    	let nodeType = "";
    	let mH = new mappingsHelper();
    	let mappingFields = mH.getMappingFields($metadata);
    	let nodeId = 0;

    	function openGyreMappings(node, e) {
    		$$invalidate(6, mappingFields = mH.getMappingFields($metadata));
    		$$invalidate(1, showGyreMappings = "block");
    		nodeId = node.id;
    		let x = e.clientX - 480 / 2;
    		let y = e.clientY - 200;
    		if (x < 0) x = 0;
    		if (y < 0) y = 0;
    		if (x + 480 > window.innerWidth) x = window.innerWidth - 540;
    		if (y + 400 > window.innerHeight) y = window.innerHeight - 400;
    		$$invalidate(2, gyreMappingsDialogLeft = x + "px");
    		$$invalidate(3, gyreMappingsDialogTop = y + "px");
    		$$invalidate(4, widgets = node.widgets);
    		console.log("W", widgets);
    		$$invalidate(5, nodeType = node.type);
    		if (!$metadata.mappings) set_store_value(metadata, $metadata.mappings = {}, $metadata);
    		$$invalidate(7, mappings = $metadata.mappings[nodeId]);
    		if (!mappings) $$invalidate(7, mappings = []);
    	}

    	window.openGyreMappings = openGyreMappings; // expose open function so it can be called from ComfyUI menu extension

    	// check of a widget (=a node property) is connected to a form field
    	function checkGyreMapping(node, widget, index) {
    		if (!$metadata.mappings) return;
    		if (!$metadata.mappings[node.id]) return;

    		for (let i = 0; i < $metadata.mappings[node.id].length; i++) {
    			let mapping = $metadata.mappings[node.id][i];

    			//  console.log("name",widget.name,index)
    			if (mapping.toField === widget.name) {
    				mapping.toIndex = index;
    				let label = widget.label || widget.name;
    				return label + "=" + mapping.fromField;
    			}
    		}
    	}

    	window.checkGyreMapping = checkGyreMapping;

    	function gyreClearAllComboValues() {
    		set_store_value(metadata, $metadata.combo_values = {}, $metadata);
    		set_store_value(metadata, $metadata.selected_combo_values = [], $metadata);
    	}

    	window.gyreClearAllComboValues = gyreClearAllComboValues;

    	function closeDialog() {
    		$$invalidate(1, showGyreMappings = "none");
    	}

    	let mappings = [];
    	let fromField = "";
    	let toField = "";
    	let addField = "";

    	function addMapping() {
    		if (!toField || !fromField) return;
    		if (!nodeId) return;
    		mappings.push({ fromField, toField });
    		$$invalidate(7, mappings);
    		set_store_value(metadata, $metadata.mappings[nodeId] = mappings, $metadata);
    		$$invalidate(8, fromField = $$invalidate(9, toField = $$invalidate(10, addField = "")));
    	}

    	function addFormField(fieldName) {
    		if (!nodeId) return;
    		if (!fieldName) return;
    		if (checkIfFieldNameExists(fieldName)) return;
    		let widget = getWidget(fieldName);
    		if (!widget) return;
    		let type = widget.type;
    		let label = fieldName;
    		label = label.replace(/_/g, " ");
    		label = label.charAt(0).toUpperCase() + label.slice(1);

    		let field = {
    			name: fieldName,
    			label,
    			default: widget.value
    		};

    		if (type === "number") {
    			field.type = "slider";

    			if (widget.options) {
    				field.min = widget.options.min;
    				field.max = widget.options.max;
    				field.step = widget.options.round;
    			} // field.default=field.min         
    		}

    		if (type === "customtext") {
    			field.type = "textarea";
    		}

    		if (type === "text") {
    			field.type = "text";
    		}

    		if (type === "combo") {
    			field.type = "pre_filled_dropdown";
    			field.widget_name = fieldName;
    		}

    		if (type === "toggle") {
    			field.type = "checkbox";
    		} //   field.default="false"

    		if (!field.type) return;
    		if (!$metadata.forms) set_store_value(metadata, $metadata.forms = {}, $metadata);
    		if (!$metadata.forms.default) set_store_value(metadata, $metadata.forms.default = {}, $metadata);
    		if (!$metadata.forms.default.elements) set_store_value(metadata, $metadata.forms.default.elements = [], $metadata);
    		let formFields = $metadata.forms.default.elements;
    		formFields.push(field);
    		mappings.push({ fromField: fieldName, toField: fieldName });
    		$$invalidate(7, mappings);
    		set_store_value(metadata, $metadata.mappings[nodeId] = mappings, $metadata);
    		$$invalidate(8, fromField = $$invalidate(9, toField = $$invalidate(10, addField = "")));
    	} // 

    	function getWidget(fieldName) {
    		if (!widgets) return;

    		for (let i = 0; i < widgets.length; i++) {
    			let widget = widgets[i];
    			if (widget.name === fieldName) return widget;
    		}
    	}

    	function deleteMapping(index) {
    		mappings.splice(index, 1);
    		$$invalidate(7, mappings);
    		set_store_value(metadata, $metadata.mappings[nodeId] = mappings, $metadata);
    	}

    	function checkIfFieldNameExists(name) {
    		if (!$metadata.forms) return false;
    		if (!$metadata.forms.default) return false;
    		let formFields = $metadata.forms.default.elements;
    		if (!formFields) return false;

    		for (let i = 0; i < formFields.length; i++) {
    			let field = formFields[i];
    			if (field.name === name) return true;
    		}

    		return false;
    	}

    	function addAllFormFields() {
    		if (!widgets) return;

    		for (let i = 0; i < widgets.length; i++) {
    			let widget = widgets[i];
    			addFormField(widget.name);
    		}

    		dispatch("updateForm", {});
    	}

    	const writable_props = ['render'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Mappings> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		fromField = select_value(this);
    		$$invalidate(8, fromField);
    		$$invalidate(6, mappingFields);
    	}

    	function select1_change_handler() {
    		toField = select_value(this);
    		$$invalidate(9, toField);
    		$$invalidate(4, widgets);
    	}

    	const click_handler = e => {
    		addMapping();
    	};

    	const click_handler_1 = e => {
    		addFormField(addField);
    		dispatch("updateForm", {});
    	};

    	function select2_change_handler() {
    		addField = select_value(this);
    		$$invalidate(10, addField);
    		$$invalidate(4, widgets);
    	}

    	const click_handler_2 = e => {
    		addAllFormFields();
    	};

    	const click_handler_3 = (index, e) => {
    		deleteMapping(index);
    	};

    	const click_handler_4 = e => {
    		closeDialog();
    	};

    	$$self.$$set = $$props => {
    		if ('render' in $$props) $$invalidate(0, render = $$props.render);
    	};

    	$$self.$capture_state = () => ({
    		metadata,
    		Icon,
    		createEventDispatcher,
    		dispatch,
    		render,
    		mappingsHelper,
    		showGyreMappings,
    		gyreMappingsDialogLeft,
    		gyreMappingsDialogTop,
    		widgets,
    		nodeType,
    		mH,
    		mappingFields,
    		nodeId,
    		openGyreMappings,
    		checkGyreMapping,
    		gyreClearAllComboValues,
    		closeDialog,
    		mappings,
    		fromField,
    		toField,
    		addField,
    		addMapping,
    		addFormField,
    		getWidget,
    		deleteMapping,
    		checkIfFieldNameExists,
    		addAllFormFields,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('render' in $$props) $$invalidate(0, render = $$props.render);
    		if ('showGyreMappings' in $$props) $$invalidate(1, showGyreMappings = $$props.showGyreMappings);
    		if ('gyreMappingsDialogLeft' in $$props) $$invalidate(2, gyreMappingsDialogLeft = $$props.gyreMappingsDialogLeft);
    		if ('gyreMappingsDialogTop' in $$props) $$invalidate(3, gyreMappingsDialogTop = $$props.gyreMappingsDialogTop);
    		if ('widgets' in $$props) $$invalidate(4, widgets = $$props.widgets);
    		if ('nodeType' in $$props) $$invalidate(5, nodeType = $$props.nodeType);
    		if ('mH' in $$props) mH = $$props.mH;
    		if ('mappingFields' in $$props) $$invalidate(6, mappingFields = $$props.mappingFields);
    		if ('nodeId' in $$props) nodeId = $$props.nodeId;
    		if ('mappings' in $$props) $$invalidate(7, mappings = $$props.mappings);
    		if ('fromField' in $$props) $$invalidate(8, fromField = $$props.fromField);
    		if ('toField' in $$props) $$invalidate(9, toField = $$props.toField);
    		if ('addField' in $$props) $$invalidate(10, addField = $$props.addField);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		render,
    		showGyreMappings,
    		gyreMappingsDialogLeft,
    		gyreMappingsDialogTop,
    		widgets,
    		nodeType,
    		mappingFields,
    		mappings,
    		fromField,
    		toField,
    		addField,
    		dispatch,
    		closeDialog,
    		addMapping,
    		addFormField,
    		deleteMapping,
    		checkIfFieldNameExists,
    		addAllFormFields,
    		select0_change_handler,
    		select1_change_handler,
    		click_handler,
    		click_handler_1,
    		select2_change_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class Mappings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { render: 0 }, add_css$2, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mappings",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get render() {
    		throw new Error("<Mappings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set render(value) {
    		throw new Error("<Mappings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class loopPreparser {

      constructor(workflow) {
        this.workflow = workflow;
        this.nodeMapping = {};
      }

      getGroup(node, groups) {
        return groups.find(group => {
          const [gx, gy, gWidth, gHeight] = group.bounding;
          const [nx, ny] = node.pos;
          return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
        });
      }
      getNodeById(nodeId) {
        return this.workflow.nodes.find(node => node.id === nodeId)
      }
      getGroupByName(groupName) {
        return this.workflow.groups.find(group => group.title === groupName)
      }
      isNodeInGroup(nodeId, groupName) {
        const node = this.workflow.nodes.find(n => n.id === nodeId);
        if (!node) return false; // Node not found

        const group = this.workflow.groups.find(group => group.title === groupName && group.bounding);
        if (!group) return false; // Group not found

        const [gx, gy, gWidth, gHeight] = group.bounding;
        const [nx, ny] = node.pos;
        return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
      }
      /**
       * link data structures are redudant in ComfyUI so re-generate link infos from global linkk structure
       */
      updateNodeLinks() {
        // Step 1: Clear existing link IDs from inputs and outputs
        this.workflow.nodes.forEach(node => {
          if (node.inputs) {
            node.inputs.forEach(input => {
              input.link = null;
            });
          }
          if (node.outputs) {
            node.outputs.forEach(output => {
              output.links = [];
            });
          }
        });

        // Step 2: Iterate over links to update inputs and outputs
        this.workflow.links.forEach(link => {
          const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;
          const fromNode = this.workflow.nodes.find(node => node.id === fromNodeID);
          const toNode = this.workflow.nodes.find(node => node.id === toNodeID);

          if (fromNode && fromNode.outputs && fromNode.outputs[fromSlot]) {
            if (!fromNode.outputs[fromSlot].links) {
              fromNode.outputs[fromSlot].links = [];
            }
            fromNode.outputs[fromSlot].links.push(linkID);
          }

          if (toNode && toNode.inputs && toNode.inputs[toSlot]) {
            toNode.inputs[toSlot].link = linkID;
          }
        });
      }

     removeGyreNodesAndLinkDirectly() {
        // Iterate backwards to avoid indexing issues after removal
        for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
          const node = this.workflow.nodes[i];
          if (node.type === "GyreLoopStart" || node.type === "GyreLoopEnd") {
            const outgoingLink = this.workflow.links.find(link => link[1] === node.id);
            const incomingLink = this.workflow.links.find(link => link[3] === node.id);
            
            if (outgoingLink && incomingLink) {
              // Create a new link replacing the GyreNode
              const newLink = [this.workflow.last_link_id + 1, incomingLink[1], incomingLink[2], outgoingLink[3], outgoingLink[4], outgoingLink[5]];
              this.workflow.last_link_id++; // Update last link ID
              this.workflow.links.push(newLink);
              // Remove the original links
              this.workflow.links = this.workflow.links.filter(link => link[0] !== outgoingLink[0] && link[0] !== incomingLink[0]);
      
              // Remove the GyreLoop node
              this.workflow.nodes.splice(i, 1);
            }
          }
        }
      }
      

      /*
      for the conections between the groups add a GyreLoopStart node in-between so it is easier to make another group 
       */
      splitLinkWithGyreStartNode(linkID) {
        const linkIndex = this.workflow.links.findIndex(link => link[0] === linkID);
        if (linkIndex === -1) return // Link not found
        const originalLink = this.workflow.links[linkIndex];
        const [_, fromNodeID, fromSlot, toNodeID, toSlot, type] = originalLink;
      
        // Assuming workflow.last_node_id and workflow.last_link_id are correctly set
        const newGyreStartNodeID = ++this.workflow.last_node_id;
        const newLink1ID = ++this.workflow.last_link_id;
        const newLink2ID = ++this.workflow.last_link_id;
      
        // Create GyreStartNode
        const gyreStartNode = {
          id: newGyreStartNodeID,
          type: 'GyreLoopStart',
          pos: [0, 0],    // willbe removed anyway
          inputs:[
            {
                "name": "ANY",
                "type": "*",
                "link": 16
            }
        ]};
        this.workflow.nodes.push(gyreStartNode);
        // Create the first new link from the original source to the GyreStartNode
        const newLink1 = [newLink1ID, fromNodeID, fromSlot, newGyreStartNodeID, 0 /* Assuming slot 0 for GyreStartNode */, type];
        // Create the second new link from the GyreStartNode to the original destination
        const newLink2 = [newLink2ID, newGyreStartNodeID, 0 /* Assuming slot 0 for output */, toNodeID, toSlot, type];  
        // Add the new links to the workflow
        this.workflow.links.push(newLink1, newLink2);
        // Remove the original link
        this.workflow.links.splice(linkIndex, 1);
      }
      /* Gyre loops: reroute end loop link and make new link between groups
      */
      adjustLinksForSpecialNodes(groupName) {
        // 1. reroute to end loop
        // Assuming `this.nodeMapping` maps original node IDs to their new duplicated IDs
        const gyreLoopEndNodes = this.workflow.nodes.filter(node => node.type === "GyreLoopEnd").map(node => node.id);

        const linksToRemove = []; // Ids only
        let removedLinks = [];  // store link objects for new links between groups
        const newLinks = [];
      
        this.workflow.links.forEach(link => {
          const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;

          if (gyreLoopEndNodes.includes(toNodeID) && this.isNodeInGroup(fromNodeID, groupName)) {
            // Mark this link for removal
            linksToRemove.push(linkID);
            removedLinks.push([...link]); 
            // Create a new link from the cloned node to the "GyreLoopEnd" node
            const newLink = [this.workflow.last_link_id + 1, this.nodeMapping[fromNodeID], fromSlot, toNodeID, toSlot, type];
            newLinks.push(newLink);
            this.workflow.last_link_id++;
          }
        });

        // Remove identified links
        this.workflow.links = this.workflow.links.filter(link => !linksToRemove.includes(link[0]));

        // Add new links
        this.workflow.links.push(...newLinks);


        // For each link removed earlier...
        // Assuming removedLinks and nodeMapping are already defined
        // generate connections between groups
        removedLinks.forEach(removedLink => {
          const [removedLinkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = removedLink;
          // Find a link where the toNode is the destination of a link from a "GyreLoopStart"
          let linkFromGyreLoopStart; 
          this.workflow.links.forEach(link => {
            const [_, linkFromNodeID, __, linkToNodeID, slot, linkType] = link;
            if (this.getNodeById(linkFromNodeID).type==="GyreLoopStart" && this.isNodeInGroup(linkToNodeID,groupName)) {
              if (fromSlot===slot) linkFromGyreLoopStart=link;
            }
          });
          if (linkFromGyreLoopStart) {
            // Assuming you can find the cloned node ID for the node that was linked to by the GyreLoopStart
            const clonedToNodeID = this.nodeMapping[linkFromGyreLoopStart[3]]; // Use the toNodeID of the linkFromGyreLoopStart for mapping
            if (clonedToNodeID) {
              const newLinkID = ++this.workflow.last_link_id;
              const newLink = [newLinkID, fromNodeID, fromSlot, clonedToNodeID, fromSlot, type]; // same slot here, this is current limitation
        //      console.log("new between groups link",newLink)
              this.workflow.links.push(newLink);
              this.splitLinkWithGyreStartNode(newLinkID);
            }
          }
        });
      }

      duplicateGroupWithNodesAndLinks(groupName,groupNameClone) {
        // Assuming getGroupByName and isNodeInGroup functions are defined elsewhere
        const originalGroup = this.getGroupByName(groupName);
        if (!originalGroup) return; // Exit if group not found

        let maxNodeId = this.workflow.last_node_id;
        let maxLinkId = this.workflow.last_link_id;

        // Duplicate group
        const newGroup = JSON.parse(JSON.stringify(originalGroup));
        newGroup.title = groupNameClone; 
        newGroup.bounding[0] += originalGroup.bounding[2]+70; // Shift the new group to prevent overlap
        this.workflow.groups.push(newGroup);

        this.nodeMapping = {}; // Map old node IDs to new node IDs

        // Duplicate nodes
        this.workflow.nodes.forEach(node => {
          if (this.isNodeInGroup(node.id, groupName)) {
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.id = ++maxNodeId;
            newNode.pos[0] += originalGroup.bounding[2]+70; // Shift the new group to prevent overlap
            this.nodeMapping[node.id] = newNode.id; // Map old ID to new ID
            this.workflow.nodes.push(newNode);
           // console.log("add node", newNode)
          }
        });

        this.workflow.links.forEach(link => {
          const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link; // Destructure the original link array
          // Check if both source and target nodes are within the group being duplicated
          if (this.nodeMapping[fromNodeID] && this.nodeMapping[toNodeID]) {
            // Create a new link for the duplicated nodes
            const newLink = [
              ++maxLinkId, // Assign a new unique ID for the link
              this.nodeMapping[fromNodeID], // Map old source node ID to new
              fromSlot, // Preserve the original fromSlot
              this.nodeMapping[toNodeID], // Map old target node ID to new
              toSlot, // Preserve the original toSlot
              type // Preserve the link type
            ];
            this.workflow.links.push(newLink); // Add this new link to the workflow
          }
        });

        // outside links going inside group nodes duplication
        this.workflow.links.forEach(link => {
          const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;
          const fromNode = this.workflow.nodes.find(node => node.id === fromNodeID);
          this.workflow.nodes.find(node => node.id === toNodeID);

          // Check if the toNode is inside the group and fromNode is outside and not of specific types
          if (this.isNodeInGroup(toNodeID, groupName) && !this.isNodeInGroup(fromNodeID, groupName) &&
            fromNode.type !== 'GyreLoopStart' && fromNode.type !== 'GyreLoopEnd') {
            // Logic to duplicate the link here
            const newLinkID = ++maxLinkId; // Increment and assign new max link ID
            const newLink = [newLinkID, fromNodeID, fromSlot, this.nodeMapping[toNodeID], toSlot, type];
            this.workflow.links.push(newLink);
          }
        });
        this.workflow.last_link_id = maxLinkId;
        this.workflow.last_node_id = maxNodeId;
      
        this.adjustLinksForSpecialNodes(groupName);
        this.cloneMappings(groupName);

      }

      /**
       * clone mappings
       * @param string groupName 
       * @returns 
       */
      cloneMappings(groupName) {
        let mappings=this.workflow.extra.gyre.mappings;
        if (!mappings) return
        for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
          const node = this.workflow.nodes[i];
          if (this.isNodeInGroup(node.id,groupName)) {
            let nodeMappings=mappings[node.id];
            if (nodeMappings) {
              let newNodeID=this.nodeMapping[node.id];
              if (newNodeID) {
                mappings[newNodeID]=JSON.parse(JSON.stringify(nodeMappings));
              }
              
            }
          }
        }

        this.workflow.extra.gyre.mappings=mappings;
      }
      deactivateGroup(groupName) {
        for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
          const node = this.workflow.nodes[i];
          if (this.isNodeInGroup(node.id,groupName)) {
            node.mode=4; // deactivate it
          }
        }
        
      }
      generateLoop(arrayName,arraySize) {
        let group=this.getGroupByName(arrayName+"[]");
        if (!group) return
        group.title=arrayName+"[0]";

        if (arraySize===0) {  // deactivate group nodes
          this.deactivateGroup(arrayName+"[0]");
          this.removeGyreNodesAndLinkDirectly();    
          this.updateNodeLinks();
          return
        }
        if (arraySize>1) {  // only rename group and remove loop nodes
          for(let i=0;i<arraySize-1;i++) {  
            this.duplicateGroupWithNodesAndLinks(arrayName+"["+i+"]",arrayName+"["+(i+1)+"]");    
          }
        }
        this.removeGyreNodesAndLinkDirectly();    
        this.updateNodeLinks();
      }

    }

    class valuePreparser {

        constructor(workflow) {
          this.workflow = workflow;
          this.loopParser=new loopPreparser(workflow);
          this.rules=new rulesExecution();
          if (!workflow.extra.gyre) return
          this.metadata=workflow.extra.gyre;
          this.fieldList=[];
          if (this.metadata.forms && this.metadata.forms.default)  {
            this.fieldList=new mappingsHelper().getMappingFields(this.metadata).fields;
            //this.fieldList=this.metadata.forms.default.elements
          }
        }

        getWidgetIndex(nodeId,name) {
            let nodeWidgets=this.workflow.extra.gyre.nodeWidgets;
            for(let nId in nodeWidgets) {
                if (parseInt(nId)===nodeId) {
                    let widgets=nodeWidgets[nId];
                    for(let i=0;i<widgets.length;i++) {
                        let widget=widgets[i];
                        if (widget.name===name) return i
                    }
                }
            }
            return -1
        }
        getLinkById(linkId) {
            return this.workflow.links.find(linkArr => linkArr[0] === linkId)

        }
        getNodeById(nodeId) {
            return this.workflow.nodes.find(node => node.id === nodeId)
          }
        /* mergedImage, mask, controlnet[].image
        */
        async getImage(propertyName, arrayName="",index=0) {
            if(window.postMessageAdapter){
                let instance = window.postMessageAdapter.getWorkflowImageRequestServerInstance();
                let res = await instance.getSingleImage(propertyName, arrayName,index);
                return res;
            }
            return null;
        }
        /**
         * get layer image
         * @param {string} layerName , special names: currentLayer, currentLayerAbove, currentLayerBelow
         * @param {string} layerID , as alternative select layer by ID
         */
        async getLayerImage(layerName,layerID) {
            if(window.postMessageAdapter){
                let instance = window.postMessageAdapter.getWorkflowImageRequestServerInstance();
                let res = await instance.getLayerImage(layerName,layerID);
                return res;
            }
            return null;
        }
        /**
         * convert value (e.g. boolean) also get images from frontend
         * @param {*} value 
         * @param {object} field 
         * @param {string} arrayName 
         * @param {number} index 
         * @returns 
         */
        async convertValue(value,field,arrayName="",index=0) {
            if (field.type==="image") {

                    if (!arrayName) {

                        return await this.getImage(field.name)
                    } else {
                        let propertyName= field.name.split(".")[1];  // e.g. image from controlnet[].image
                        return await this.getImage(propertyName,arrayName,index) // e.g. image,controlnet,0 for controlnet[0].image            
                    }
            }
            if (field.type==="layer_image") {
                return await this.getLayerImage(field.name)
            }
            if (field.type==="drop_layers") {
                let idx=0;
                if (field.originalName) {
                    idx=field.index;
                }
                let arr=value.split(",");
                let layerID=arr[idx];
                return await this.getLayerImage(null,layerID)
            }
            if(field.type=="number" && !field.step && value) field.step=value;
            return  this.rules.convertValue(value,field)
        }
        /**
         * find all nodes which are connected to a mapping (nodeId, fieldFrom,toField) and set value
         * @param {object} field the field object {name,type,min,max,...}
         * @param {string} fromFieldName full name with array name and index (e.g. "steps" or "controlnet[0].model")
         * @param {*} value 
         */
        async setNodesValue(field,fromFieldName,value) {
            for (let nodeId in this.metadata.mappings) {
                let mappingList=this.metadata.mappings[nodeId];

                if (!mappingList || !mappingList.length) continue
                let nodeIdInt=parseInt(nodeId);
                let node=this.loopParser.getNodeById(nodeIdInt);
                if (!node) {
                    console.log("could not find node with id ",nodeIdInt,fromFieldName,value);
                    continue
                }

                /**
                 * workaround for ComfyUI bug: linked values are not transferred to target node, have to do it manually
                 */
                let targetFieldName="";
                let targetIndex=-1;
                let targetNode=null;
                if (node.outputs && node.outputs.length && node.outputs[0].widget) {
                    targetFieldName=node.outputs[0].widget.name;
                    let linkId=node.outputs[0].links[0];
                    let link=this.getLinkById(linkId);
                    let targetNodeId=link[3];
                    targetIndex=this.getWidgetIndex(targetNodeId,targetFieldName);
                    if (targetIndex>=0) {
                        targetNode=this.getNodeById(targetNodeId);
                    }
                }
                if (node) {
                    for(let i=0;i<mappingList.length;i++) {
                        let mapping=mappingList[i];
                        
                        if (mapping && mapping.fromField===fromFieldName) {
                            value=await this.convertValue(value,field);
                            node.widgets_values[parseInt(mapping.toIndex)]=value;
                            if (targetNode) {
                                targetNode.widgets_values[targetIndex]=value;
                            }
                        }                
                    }
                }

            }
        }
        /**
         * find all nodes which are connected to a mapping (nodeId, fieldFrom,toField) inside a group and set value
         * @param {object} field the field object {name,type,min,max,...}
         * @param {string} fromFieldName full name with array name without index "controlnet[].model")
         * @param {string} groupName the group name - e.g. controlnet[0], controlnet[1],...
         * @param {string} arrayName  the array name - e.g. controlnet
         * @param {number} arrayName  the index in array (0,1,...)
        * @param {*} value 
         */
        async setNodesValueGroup(field,fromFieldName,groupName,value,arrayName,index) {
            for (let i=0;i<this.workflow.nodes.length;i++) {
                let node=this.workflow.nodes[i];
                if (this.loopParser.isNodeInGroup(node.id,groupName)) { // only nodes in group
                    let mappingList=this.metadata.mappings[node.id];
                    if(mappingList && mappingList.length) {
                        for (let i = 0; i < mappingList.length; i++) {
                            let mapping = mappingList[i];
                            if (mapping && mapping.fromField === fromFieldName) {
                                value = await this.convertValue(value, field, arrayName, index);
                                node.widgets_values[parseInt(mapping.toIndex)] = value;
                            }
                        }
                    }
                }
            }
        }
        removeVirtualNodes() {

            // Iterate backwards to avoid indexing issues after removal
            for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
                const node = this.workflow.nodes[i];
                let isVirtualNode = false;
                if(this.workflow.extra.gyre.virtualNodes && this.workflow.extra.gyre.virtualNodes.length){
                    isVirtualNode =  this.workflow.extra.gyre.virtualNodes.includes(node.type);
                }

                if (isVirtualNode || node.type === "PrimitiveNode") {
                    const outgoingLink = this.workflow.links.find(link => link[1] === node.id);

                    // Remove the  link
                    if (outgoingLink) this.workflow.links = this.workflow.links.filter(link => link[0] !== outgoingLink[0]);

                    // Remove the GyreLoop node
                    this.workflow.nodes.splice(i, 1);
                }
            }
        }

        /**
         * Modify workflow values by using mapping and data from image editor
         * data object has to be filled with
         *  prompt
         *  negativePrompt
         *  hasMask
         *  optional: controlnet array
         * @param {object} data 
         */
        async setValues(data) {
            if (!this.metadata) return
            if (!this.metadata.mappings) return
            for (let name in data) {
                let value=data[name];
                if (!Array.isArray(value)) {
                    let field=this.rules.getField(name,this.fieldList);
                    if (field) await this.setNodesValue(field,field.name,value);
                } else {
                    // replace array of object values
                    let arrayName=name;
                    for(let i=0;i<data[arrayName].length;i++) {
                        let element=data[arrayName][i];
                        for(let propName in element) {
                            let fieldName=arrayName+"[]."+propName;      // e.g. controlnet[].type
                            let fieldNameIndex=arrayName+"["+i+"]."+propName;      // e.g. controlnet[0].type
                            let value=element[propName];
                            let field=this.rules.getField(fieldName,this.fieldList);
                            await this.setNodesValue(field,fieldNameIndex,value);
                            let groupName=arrayName+"["+i+"]";                // e.g. controlnet[0]
                            await this.setNodesValueGroup(field,fieldName,groupName,value,arrayName,i);
                        }
                    }
                }
            }

        }
        /**
         * split values in CSV format from string into seperate values with field_0, field_1
         * values are separated by ;
         * Definition by split_value_num and split_value_type
         * @param {*} data 
         */
        splitCustomValues(data) {
            for (let name in data) {
                let value=data[name];
                let field=this.rules.getField(name,this.fieldList);
                if (field && field.split_value_num && field.split_value_type) {
                    let arr=value.split(";");
                    for(let i=0;i<field.split_value_num;i++) {
                        let v=arr[i];
                        // type conversion
                        let splitField={name:name+"_"+i,type:field.split_value_type,step:parseFloat(v)};

                        v=this.rules.convertValue( v,splitField);  
                        data[name+"_"+i]=v;
                    }
                }
            }
        }
    }

    class ComfyUIPreparser {

        constructor(workflow) {
            this.workflow=workflow;
            if (!workflow.extra.gyre) return
            this.metadata=workflow.extra.gyre;
            this.fieldList=[];
            if (this.metadata.forms && this.metadata.forms.default)  {
                this.fieldList=new mappingsHelper().getMappingFields(this.metadata).fields;
            }  
        }
        /**
         * extend workflow to set all loop nodes
         * @param {object} data 
         */
        generateLoops(data) {
            let loop=new loopPreparser(this.workflow);
            for (let name in data) {
                let value=data[name];
                if (Array.isArray(value)) {     // e.g. controlnet
                    loop.generateLoop(name,data[name].length);
                }
            }
        }
        /**
         * execute rules on 
         * @param {object} data 
         */
        executeAllRules(data) {
            let rules=new rulesExecution();
            // marcin
            if(!this.metadata.rules) return;
            rules.execute(data,this.fieldList,this.metadata.rules,{},"__ignore_arrays"); // first execute rules on non array props
            for (let name in data) {
                let value=data[name];
                if (Array.isArray(value)) {     // e.g. controlnet
                    for(let i=0;i<data[name].length;i++) {
                        rules=new rulesExecution();
                        let arrayIdx={};
                        arrayIdx[name]=i;
                        rules.execute(data,this.fieldList,this.metadata.rules,arrayIdx,name);    // execute rules on array
                    }
                }
            }

        }
        /**
         * replace all mappings with real values
         * @param {object} data 
         */
        async setValues(data) {
            let vp=new valuePreparser(this.workflow);
            await vp.setValues(data);
            await vp.removeVirtualNodes();
        }
        splitCustomValues(data) {
            let vp=new valuePreparser(this.workflow);
            vp.splitCustomValues(data);
        }
        async execute(data) {
            this.generateLoops(data);
            this.executeAllRules(data);
            this.splitCustomValues(data);
            await this.setValues(data);      
          //  console.log("data",data)  
        }

        getTestData() {

            return {
                prompt: "fashion dog",
                negativePrompt: "ugly",
                hasMask: true,
                hasinitImage: true,
                rise: "0.0;0.3432423",
                rise_red: "0.1;0.55534",
                rise_gray: "2;55",
                blend_if_channel: "gray",
                controlnet:[
                    { type:"pose",image:"empty"},
                    { type:"depth",image:"empty"},
                    { type:"scribble",image:"empty"}
                ],
                // some custom fields
                seed: 123,
                steps: 20
            }
        }

    }

    class nodesManager {
        constructor() {
            // @ts-ignore
            this.allNodes=LiteGraph.registered_node_types;
        }
        /**
         * check if there are some node types missing from one workflow
         * @param {*} workflow 
         * @returns {boolean} true if all is ok, false otherwise
         */
        checkMissingNodes(workflow) {
            if (!workflow.nodes) return true
            for(let i=0;i<workflow.nodes.length;i++) {
                let type=workflow.nodes[i].type;
                if (!this.allNodes[type]) {
                    return false
                }
            }
            return true
        }

    }

    class modelsManager {
        constructor(availableModels) {
            this.availableModels=availableModels;
        }
        /**
         * check if there are some models missing from one workflow
         * @param {*} workflow 
         * @returns {boolean} true if all is ok, false otherwise
         */
        checkMissingModels(workflow) {
            if (!workflow.extra || !workflow.extra.gyre || !workflow.extra.gyre.models) return true
            if (!this.availableModels) return true
            let models=workflow.extra.gyre.models;
            for(let i=0;i<models.length;i++) {
                let model=models[i];
                if (typeof model === "string") {
                    let modelObj={path:model};
                    model=modelObj;
                }            
                if (!this.availableModels.includes(model.path)) return false
            }
        
            return true
        }

    }

    /* src\WorkflowManager.svelte generated by Svelte v3.59.2 */

    const { console: console_1, window: window_1 } = globals;
    const file = "src\\WorkflowManager.svelte";

    function add_css$1(target) {
    	append_styles(target, "svelte-1ac5lll", "@import 'dist/build/gyrestyles.css';\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSIsInNvdXJjZXMiOlsiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gICAgaW1wb3J0IEZvcm1CdWlsZGVyIGZyb20gXCIuL0Zvcm1CdWlsZGVyLnN2ZWx0ZVwiXHJcbiAgICBpbXBvcnQgRWRpdE1vZGVscyBmcm9tIFwiLi9FZGl0TW9kZWxzLnN2ZWx0ZVwiXHJcblxyXG4gICAgaW1wb3J0IFJ1bGVFZGl0b3IgZnJvbSBcIi4vUnVsZUVkaXRvci5zdmVsdGVcIlxyXG4gICAgaW1wb3J0IE1hcHBpbmdzIGZyb20gXCIuL01hcHBpbmdzLnN2ZWx0ZVwiXHJcblxyXG4gICAgaW1wb3J0IHt3cml0YWJsZX0gZnJvbSAnc3ZlbHRlL3N0b3JlJ1xyXG4gICAgaW1wb3J0IHtvbk1vdW50fSBmcm9tICdzdmVsdGUnXHJcbiAgICBpbXBvcnQge21ldGFkYXRhfSBmcm9tICcuL3N0b3Jlcy9tZXRhZGF0YSdcclxuICAgIGltcG9ydCBJY29uIGZyb20gJy4vSWNvbi5zdmVsdGUnXHJcbiAgICBpbXBvcnQgeyBDb21meVVJUHJlcGFyc2VyIH0gZnJvbSAnLi9Db21meVVJUHJlcGFyc2VyLmpzJ1xyXG4gICAgaW1wb3J0IHsgbWFwcGluZ3NIZWxwZXIgfSBmcm9tICcuL21hcHBpbmdzSGVscGVyLmpzJ1xyXG4gICAgaW1wb3J0IHsgbm9kZXNNYW5hZ2VyIH0gZnJvbSAnLi9ub2Rlc01hbmFnZXIuanMnXHJcbiAgICBpbXBvcnQgeyBtb2RlbHNNYW5hZ2VyIH0gZnJvbSAnLi9tb2RlbHNNYW5hZ2VyLmpzJ1xyXG5cclxuICAgIGxldCBhbGx3b3JrZmxvd3M7XHJcbiAgICBsZXQgbW92aW5nID0gZmFsc2U7XHJcbiAgICBsZXQgbGVmdCA9IDEwXHJcbiAgICBsZXQgdG9wID0gMTBcclxuICAgIGxldCBzdHlsZWVsO1xyXG4gICAgbGV0IGxvYWRlZHdvcmtmbG93O1xyXG5cclxuICAgIGxldCBmb2xkT3V0ID0gZmFsc2VcclxuICAgIGxldCBuYW1lID0gXCJcIiAgIC8vIGN1cnJlbnQgbG9hZGVkIHdvcmtmbG93IG5hbWVcclxuICAgIGxldCBzdGF0ZSA9IFwibGlzdFwiXHJcbiAgICBsZXQgdGFncyA9IFtcIlR4dDJJbWFnZVwiLCBcIklucGFpbnRpbmdcIiwgXCJDb250cm9sTmV0XCIsIFwiTGF5ZXJNZW51XCIsIFwiRGVhY3RpdmF0ZWRcIixcIkltZzJJbWdcIixcIkRlZmF1bHRcIl1cclxuICAgIGxldCB3b3JrZmxvd0xpc3QgPSB3cml0YWJsZShbXSkgICAgLy8gdG9kbzpsb2FkIGFsbCB3b3JrZmxvdyBiYXNpYyBkYXRhIChuYW1lLCBsYXN0IGNoYW5nZWQgYW5kIGd5cmUgb2JqZWN0KSBmcm9tIHNlcnZlciB2aWEgc2VydmVyIHJlcXVlc3RcclxuICAgIGxldCB3b3JrZmxvd2FwaUxpc3Q9IHdyaXRhYmxlKFtdKTtcclxuICAgIGxldCB3b3JrZmxvd2RlYnVnTGlzdD0gd3JpdGFibGUoW10pO1xyXG4gICAgbGV0IHdvcmtmbG93Zm9ybUxpc3Q9IHdyaXRhYmxlKFtdKTtcclxuICAgIGxldCBhY3RpdmF0ZWRUYWdzID0ge31cclxuICAgIGxldCBzZWxlY3RlZFRhZyA9IFwiXCJcclxuICAgIGxldCBvcmdpbmFsbmFtZTtcclxuICAgIGxldCBkdXBsaWNhdGUgPSBmYWxzZVxyXG4gICAgbGV0IGRlYnVnPWZhbHNlXHJcbiAgICBsZXQgZGVidWdtb2RlPSdlcnJvcm1vZGUnXHJcbiAgICBsZXQgYWN0aW9uaWNvbmNsaWNrZWRcclxuICAgIGxldCB2aXJ0dWFsTm9kZXMgPSBbXVxyXG4gICAgbGV0IGRlYWN0aXZhdGVkd29ya2Zsb3dzID0gW11cclxuICAgIGxldCBhbGx3b3JrZmxvd3N3aXRoZGVmYXVsdHMgXHJcblxyXG4gICAgbGV0IGFsbE1vZGVscz1bXVxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oKSB7XHJcbiAgICAgICAgbW92aW5nID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShlKSB7XHJcbiAgICAgICAgaWYgKG1vdmluZykge1xyXG4gICAgICAgICAgICBsZWZ0ICs9IGUubW92ZW1lbnRYO1xyXG4gICAgICAgICAgICB0b3AgKz0gZS5tb3ZlbWVudFk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91bnQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGF3YWl0IGdldEFsbE1vZGVscygpXHJcblxyXG4gICAgICAgIGF3YWl0IGxvYWRMaXN0KCk7XHJcbiAgICAgICAgYXdhaXQgbG9hZExvZ0xpc3QoKTtcclxuICAgICAgICBhZGRFeHRlcm5hbExvYWRMaXN0ZW5lcigpO1xyXG4gICAgICAgIGxldCBsYXN0bG9hZGVkd29ya2Zsb3duYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJsYXN0Z3lyZXdvcmtmbG93bG9hZGVkXCIpO1xyXG4gICAgICAgIGlmKGxhc3Rsb2FkZWR3b3JrZmxvd25hbWUpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnQgPSAkd29ya2Zsb3dMaXN0LmZpbmQoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwubmFtZSA9PSBsYXN0bG9hZGVkd29ya2Zsb3duYW1lO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgbG9hZFdvcmtmbG93KGN1cnJlbnQpXHJcbiAgICAgICAgICAgIGxvYWRVSUNvbXBvbmVudHMoKVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfSlcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gYWRkRXh0ZXJuYWxMb2FkTGlzdGVuZXIoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21meS1maWxlLWlucHV0XCIpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dExpc3RlbmVyID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZmlsZUlucHV0ICYmIGZpbGVJbnB1dC5maWxlcyAmJiBmaWxlSW5wdXQuZmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3IERhdGUoZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZCkudG9EYXRlU3RyaW5nKClcclxuICAgICAgICAgICAgICAgIGxldCBmaXhlZGZpbGVuYW1lID0gZ2V0QXZhbGFibGVGaWxlTmFtZShmaWxlSW5wdXQuZmlsZXNbMF0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JhcGggPSB3aW5kb3cuYXBwLmdyYXBoLnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGgubmFtZSA9IGZpeGVkZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICBncmFwaC5sYXN0TW9kaWZpZWQgPSBmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkXHJcbiAgICAgICAgICAgICAgICBpZiAoIWdyYXBoLmV4dHJhPy53b3Jrc3BhY2VfaW5mbykgZ3JhcGguZXh0cmEud29ya3NwYWNlX2luZm8gPSBbXTtcclxuICAgICAgICAgICAgICAgIGdyYXBoLmV4dHJhLndvcmtzcGFjZV9pbmZvLm5hbWUgPSBmaXhlZGZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEud29ya3NwYWNlX2luZm8ubGFzdE1vZGlmaWVkID0gZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZDtcclxuICAgICAgICAgICAgICAgIGdyYXBoLmV4dHJhLndvcmtzcGFjZV9pbmZvLmxhc3RNb2RpZmllZFJlYWRhYmxlID0gbmV3IERhdGUoZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZCkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFncmFwaC5leHRyYS5neXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEuZ3lyZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEuZ3lyZS5sYXN0TW9kaWZpZWQgPSBmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEuZ3lyZS5sYXN0TW9kaWZpZWRSZWFkYWJsZSA9IG5ldyBEYXRlKGZpbGVJbnB1dC5maWxlc1swXS5sYXN0TW9kaWZpZWQpLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsb2FkZWR3b3JrZmxvdyA9IGdyYXBoO1xyXG4gICAgICAgICAgICAgICAgbG9hZFdvcmtmbG93KGdyYXBoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZmlsZUlucHV0Py5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZpbGVJbnB1dExpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGdldEF2YWxhYmxlRmlsZU5hbWUobmFtZSkge1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuICduZXcnXHJcbiAgICAgICAgcmV0dXJuIG5hbWUgICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIG1vdmluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBpc1Zpc2libGUod29ya2Zsb3cpIHtcclxuICAgICAgICBsZXQgbXl0YWdzID0gd29ya2Zsb3c/Lmd5cmU/LnRhZ3MgfHwgW107XHJcbiAgICAgICAgZm9yIChsZXQgYWN0aXZlVGFnIGluIGFjdGl2YXRlZFRhZ3MpIHtcclxuICAgICAgICAgICAgaWYgKGFjdGl2YXRlZFRhZ3NbYWN0aXZlVGFnXSAmJiAhbXl0YWdzLmluY2x1ZGVzKGFjdGl2ZVRhZykpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVhZCBhbGwgbG9nc1xyXG4gICAgICovXHJcbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkTG9nTGlzdCgpIHtcclxuICAgICAgICAvLyB0b2RvOiBtYWtlIHNlcnZlciByZXF1ZXN0IGFuZCByZWFkICRtZXRhZGF0YSBvZiBhbGwgZXhpc3Rpbmcgd29ya2Zsb3dzIG9uIGZpbGVzeXN0ZW1cclxuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgc2NhbkxvY2FsTmV3RmlsZXMoJ2xvZ3MnKTtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQuc29ydCgoYSxiKSA9PiBiLm5hbWUucmVwbGFjZSgvW14wLTldL2csXCJcIikgLSBhLm5hbWUucmVwbGFjZSgvW14wLTldL2csXCJcIikpO1xyXG4gICAgICAgIHdvcmtmbG93YXBpTGlzdC5zZXQocmVzdWx0KVxyXG5cclxuXHJcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2NhbkxvY2FsTmV3RmlsZXMoJ2RlYnVncycpO1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zb3J0KChhLGIpID0+IGIubmFtZS5yZXBsYWNlKC9bXjAtOV0vZyxcIlwiKSAtIGEubmFtZS5yZXBsYWNlKC9bXjAtOV0vZyxcIlwiKSk7XHJcbiAgICAgICAgd29ya2Zsb3dkZWJ1Z0xpc3Quc2V0KHJlc3VsdCk7XHJcblxyXG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IHNjYW5Mb2NhbE5ld0ZpbGVzKCdmb3JtZGF0YScpO1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zb3J0KChhLGIpID0+IGIubmFtZS5yZXBsYWNlKC9bXjAtOV0vZyxcIlwiKSAtIGEubmFtZS5yZXBsYWNlKC9bXjAtOV0vZyxcIlwiKSk7XHJcbiAgICAgICAgd29ya2Zsb3dmb3JtTGlzdC5zZXQocmVzdWx0KTtcclxuXHJcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgc2NhbkxvY2FsTmV3RmlsZXMoJ2RlYWN0aXZhdGVkd29ya2Zsb3dzJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZXN1bHRcIixyZXN1bHQpO1xyXG4gICAgICAgIGlmKHJlc3VsdC5sZW5ndGgpe1xyXG4gICAgICAgICAgICBkZWFjdGl2YXRlZHdvcmtmbG93cyA9ICBKU09OLnBhcnNlKHJlc3VsdFswXS5qc29uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZWFkIGFsbCB3b3JrZmxvd3NcclxuICAgICAqL1xyXG4gICAgYXN5bmMgZnVuY3Rpb24gbG9hZExpc3QoKSB7XHJcbiAgICAgICAgLy8gdG9kbzogbWFrZSBzZXJ2ZXIgcmVxdWVzdCBhbmQgcmVhZCAkbWV0YWRhdGEgb2YgYWxsIGV4aXN0aW5nIHdvcmtmbG93cyBvbiBmaWxlc3lzdGVtXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IHNjYW5Mb2NhbE5ld0ZpbGVzKClcclxuICAgICAgICBsZXQgcmVzdWx0ZGVmYXVsdHMgPSBhd2FpdCBzY2FuTG9jYWxOZXdGaWxlcygnZGVmYXVsdHMnKTtcclxuICAgICAgICByZXN1bHRkZWZhdWx0cyA9IHJlc3VsdGRlZmF1bHRzLm1hcCgoZWwpID0+IHtcclxuICAgICAgICAgICAgbGV0IGpzbiA9IEpTT04ucGFyc2UoZWwuanNvbik7XHJcbiAgICAgICAgICAgIGpzbi5leHRyYS5neXJlLnRhZ3MucHVzaChcIkRlZmF1bHRcIik7XHJcbiAgICAgICAgICAgIGVsLmpzb24gPSBKU09OLnN0cmluZ2lmeShqc24pO1xyXG4gICAgICAgICAgICBsZXQgcmVzID0ge2RlZmF1bHR3b3JrZmxvdzp0cnVlLC4uLmVsfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXN1bHQgPSBbLi4ucmVzdWx0ZGVmYXVsdHMsLi4ucmVzdWx0XTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGFfd29ya2Zsb3dfbGlzdCA9IHJlc3VsdC5tYXAoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSB7bmFtZTogZWwubmFtZX1cclxuICAgICAgICAgICAgaWYoZWwuZGVmYXVsdHdvcmtmbG93KSAgcmVzLmRlZmF1bHR3b3JrZmxvdyA9IHRydWVcclxuICAgICAgICAgICAgbGV0IGd5cmUgPSBudWxsXHJcbiAgICAgICAgICAgIGlmIChlbC5qc29uKSBneXJlID0gSlNPTi5wYXJzZShlbC5qc29uKS5leHRyYS5neXJlXHJcbiAgICAgICAgICAgIHJlcy5sYXN0TW9kaWZpZWRSZWFkYWJsZSA9IEpTT04ucGFyc2UoZWwuanNvbikuZXh0cmEuZ3lyZT8ubGFzdE1vZGlmaWVkUmVhZGFibGUgfHwgXCJcIlxyXG4gICAgICAgICAgICByZXMuanNvbiA9IGVsLmpzb25cclxuICAgICAgICAgICAgcmVzLm1pc3NpbmdOb2Rlcz1lbC5taXNzaW5nTm9kZXNcclxuICAgICAgICAgICAgcmVzLm1pc3NpbmdNb2RlbHM9ZWwubWlzc2luZ01vZGVsc1xyXG4gICAgICAgICAgICBpZiAoZ3lyZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLmd5cmUgPSBneXJlXHJcbiAgICAgICAgICAgICAgICByZXMuZ3lyZS5sYXN0TW9kaWZpZWRSZWFkYWJsZSA9IEpTT04ucGFyc2UoZWwuanNvbikuZXh0cmEuZ3lyZT8ubGFzdE1vZGlmaWVkUmVhZGFibGUgfHwgXCJcIlxyXG4gICAgICAgICAgICAgICAgcmVzLmd5cmUubGFzdE1vZGlmaWVkID0gSlNPTi5wYXJzZShlbC5qc29uKS5leHRyYS5neXJlPy5sYXN0TW9kaWZpZWQgfHwgXCJcIlxyXG4gICAgICAgICAgICAgICAgaWYoIXJlcy5neXJlLndvcmtmbG93aWQpIHJlcy5neXJlLndvcmtmbG93aWQgPSAgKE1hdGgucmFuZG9tKCkgKyAxKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHdvcmtmbG93TGlzdC5zZXQoZGF0YV93b3JrZmxvd19saXN0KVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBjdXN0b21fdWlfY29tcG9uZW50c1xyXG4gICAgLyoqXHJcbiAgICAgKiBnZXQgbGlzdCB3aXRoIGFsbCBVSSBjb21wb25lbnRzXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRVSUNvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgY3VzdG9tX3VpX2NvbXBvbmVudHMgPSBhd2FpdCBnZXRMaXN0RnJvbVNlcnZlcigpXHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNPTVBPTkVOVFNcIixjdXN0b21fdWlfY29tcG9uZW50cylcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0IGxpc3Qgb2YgYWxsIGluc3RhbGxlZCBtb2RlbHNcclxuICAgICAqL1xyXG4gICAgIGFzeW5jIGZ1bmN0aW9uIGdldEFsbE1vZGVscygpIHtcclxuICAgICAgICBsZXQgcmVzID0gYXdhaXQgZ2V0TGlzdEZyb21TZXJ2ZXIoXCIvZ3lyZS9nZXRfYWxsX21vZGVsc1wiKVxyXG4gICAgICAgIGlmIChyZXMpIGFsbE1vZGVscz1yZXMubW9kZWxzXHJcbiAvLyAgICAgICBjb25zb2xlLmxvZyhcIkFsbCBtb2RlbHNcIixhbGxNb2RlbHMpXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVEZWFjdGl2YXRlZERlZmF1bHRXb3JrZmxvd3MoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2d5cmUvdXBsb2FkX2xvZ19qc29uX2ZpbGVgLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlX3BhdGg6ICdkZWFjdGl2YXRlZHdvcmtmbG93cy5qc29uJyxcclxuICAgICAgICAgICAgICAgICAgICBqc29uX3N0cjogSlNPTi5zdHJpbmdpZnkoZGVhY3RpdmF0ZWR3b3JrZmxvd3MpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnZGlyOidkZWFjdGl2YXRlZHdvcmtmbG93cydcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHNhdmluZyB3b3JrZmxvdyAuanNvbiBmaWxlOiBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNhdmluZyB3b3Jrc3BhY2U6XCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBzY2FuTG9jYWxOZXdGaWxlcyh0eXBlKSB7XHJcbiAgICAgICAgbGV0IGV4aXN0Rmxvd0lkcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvZ3lyZS9yZWFkd29ya2Zsb3dkaXJcIiwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBleGlzdEZsb3dJZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgaWYodHlwZSE9J2xvZ3MnICYmIHR5cGUhPSdkZWJ1Z3MnICYmIHR5cGUhPSdmb3JtZGF0YScgJiYgdHlwZSE9J2RlYWN0aXZhdGVkd29ya2Zsb3dzJykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZml4RGF0ZXNGcm9tU2VydmVyKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlIT0nZGVmYXVsdHMnKXtcclxuICAgICAgICAgICAgICAgICAgICBhbGx3b3JrZmxvd3MgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIG1hcmtXb3JrZmxvd3NXaXRoTWlzc2luZ05vZGVzQW5kTW9kZWxzKHJlc3VsdClcclxuICAgICAgICAgICAgICAgIGFsbHdvcmtmbG93c3dpdGhkZWZhdWx0cyA9IHJlc3VsdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNjYW4gbG9jYWwgbmV3IGZpbGVzOlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1hcmtXb3JrZmxvd3NXaXRoTWlzc2luZ05vZGVzQW5kTW9kZWxzKGxpc3QpIHtcclxuICAgICAgICBsZXQgbm09bmV3IG5vZGVzTWFuYWdlcigpXHJcbiAgICAgICAgbGV0IG1tPW5ldyBtb2RlbHNNYW5hZ2VyKGFsbE1vZGVscylcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGxpc3QubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICBsZXQgZW50cnk9bGlzdFtpXVxyXG4gICAgICAgICAgICBpZiAoZW50cnkuanNvbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHdvcmtmbG93PUpTT04ucGFyc2UoZW50cnkuanNvbilcclxuICAgICAgICAgICAgICAgIGxldCByZXM9bm0uY2hlY2tNaXNzaW5nTm9kZXMod29ya2Zsb3cpXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlcykgZW50cnkubWlzc2luZ05vZGVzPXRydWVcclxuICAgICAgICAgICAgICAgIHJlcz1tbS5jaGVja01pc3NpbmdNb2RlbHMod29ya2Zsb3cpXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlcykgZW50cnkubWlzc2luZ01vZGVscz10cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBmdW5jdGlvbiBnZXRMaXN0RnJvbVNlcnZlcihlbmRwb2ludD1cIi9neXJlL2NvbGxlY3RfZ3lyZV9jb21wb25lbnRzXCIpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGVuZHBvaW50LCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBcIlwiXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpOyAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGdldExpc3RGcm9tU2VydmVyOlwiLGVuZHBvaW50LCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBmaXhEYXRlc0Zyb21TZXJ2ZXIocmVzdWx0KSB7XHJcbiAgICAgICAgbGV0IG5ld2VsID0gcmVzdWx0Lm1hcCgoZWwpID0+IHtcclxuICAgICAgICAgICAgbGV0IG9iampzID0gSlNPTi5wYXJzZShlbC5qc29uKTtcclxuICAgICAgICAgICAgb2JqanMuZXh0cmEuZ3lyZS5sYXN0TW9kaWZpZWQgPSBuZXcgRGF0ZShlbC5sYXN0bW9kaWZpZWQgKiAxMDAwKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGxldCBkYXRlc3RyID0gbmV3IERhdGUoZWwubGFzdG1vZGlmaWVkICogMTAwMCkudG9JU09TdHJpbmcoKTtcclxuICAgICAgICAgICAgb2JqanMuZXh0cmEuZ3lyZS5sYXN0TW9kaWZpZWRSZWFkYWJsZSA9IGRhdGVzdHIuc3BsaXQoJ1QnKVswXSArIFwiIFwiICsgZGF0ZXN0ci5zcGxpdCgnVCcpWzFdLnJlcGxhY2UoL1xcLlteLy5dKyQvLCBcIlwiKTtcclxuICAgICAgICAgICAgbGV0IGpzb24gPSBKU09OLnN0cmluZ2lmeShvYmpqcyk7XHJcbiAgICAgICAgICAgIHJldHVybiB7Li4uZWwsIGpzb259XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbmV3ZWw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRXb3JrZmxvdyh3b3JrZmxvdyxlKSB7XHJcblxyXG4gICAgICBpZihhY3Rpb25pY29uY2xpY2tlZCl7XHJcbiAgICAgICAgICBhY3Rpb25pY29uY2xpY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgICAgYXdhaXQgbG9hZExpc3QoKVxyXG4gICAgICAgIGlmICghd29ya2Zsb3cpIHJldHVyblxyXG4gICAgICAgIGlmICghd29ya2Zsb3cuZ3lyZSkge1xyXG4gICAgICAgICAgICB3b3JrZmxvdy5neXJlID0ge307XHJcbiAgICAgICAgICAgIHdvcmtmbG93Lmd5cmUudGFncyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvcmdpbmFsbmFtZSA9IHdvcmtmbG93Lm5hbWU7XHJcbiAgICAgIC8vICBjb25zb2xlLmxvZyhcImxvYWQgd29ya2Zsb3chIVwiLG9yZ2luYWxuYW1lLHdvcmtmbG93Lm5hbWUpO1xyXG4gICAgICAgIG5hbWUgPSB3b3JrZmxvdy5uYW1lXHJcbiAgICAgICAgJG1ldGFkYXRhID0gd29ya2Zsb3cuZ3lyZSAgICAgICAgXHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEudGFncykgJG1ldGFkYXRhLnRhZ3M9W11cclxuICAgICAgICBpZiAod2luZG93LmFwcC5ncmFwaCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJhcHAuZ3JhcGggaXMgbnVsbCBjYW5ub3QgbG9hZCB3b3JrZmxvd1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod2luZG93Lmd5cmVDbGVhckFsbENvbWJvVmFsdWVzKSB3aW5kb3cuZ3lyZUNsZWFyQWxsQ29tYm9WYWx1ZXMoKVxyXG5cclxuICAgICAgICBsZXQgY3VycmVudCA9IGFsbHdvcmtmbG93c3dpdGhkZWZhdWx0cy5maW5kKChlbCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZWwubmFtZSA9PSB3b3JrZmxvdy5uYW1lO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChzdGF0ZT09XCJlcnJvcmxvZ3NcIil7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKGRlYnVnbW9kZT09J2Vycm9ybW9kZScpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSAkd29ya2Zsb3dhcGlMaXN0LmZpbmQoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLm5hbWUgPT0gd29ya2Zsb3cubmFtZTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYXBwLmxvYWRBcGlKc29uKEpTT04ucGFyc2UoY3VycmVudC5qc29uKSk7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFwiZXJyb3Jsb2dzXCJcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGVidWdtb2RlPT0nZGVidWdtb2RlJyl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gJHdvcmtmbG93ZGVidWdMaXN0LmZpbmQoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLm5hbWUgPT0gd29ya2Zsb3cubmFtZTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBsZXQgd2YgPSBKU09OLnBhcnNlKGN1cnJlbnQuanNvbik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYXBwLmxvYWRHcmFwaERhdGEod2YpO1xyXG4gICAgICAgICAgICAgICAgc3RhdGU9XCJlcnJvcmxvZ3NcIlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RneXJld29ya2Zsb3dsb2FkZWQnLHdvcmtmbG93Lm5hbWUpO1xyXG4gICAgICAgIGlmICghbG9hZGVkd29ya2Zsb3cpIHtcclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2YgPSBKU09OLnBhcnNlKHdvcmtmbG93Lmpzb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF3Zi5uYW1lICYmIG5hbWUpIHdmLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFwcC5sb2FkR3JhcGhEYXRhKHdmKTtcclxuICAgICAgICAgICAgICAgIC8vd2luZG93LmFwcC5sb2FkR3JhcGhEYXRhKHdvcmtmbG93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCB3ZiA9IEpTT04ucGFyc2UoY3VycmVudC5qc29uKTtcclxuICAgICAgICAgICAgICAgIGlmICghd2YubmFtZSAmJiBuYW1lKSB3Zi5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hcHAubG9hZEdyYXBoRGF0YSh3Zik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBzdGF0ZT1cInByb3BlcnRpZXNcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uICB0ZXN0Rmlyc3RQYXNzKCkge1xyXG4gICAgICAgIGxldCB3b3JrZmxvdz13aW5kb3cuYXBwLmdyYXBoLnNlcmlhbGl6ZSgpXHJcbiAgICAgICAgd29ya2Zsb3c9SlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh3b3JrZmxvdykpXHJcbiAgICAgICAgY29uc29sZS5sb2cod29ya2Zsb3cpXHJcbi8vICAgICAgICBsZXQgbG9vcD1uZXcgbG9vcFByZXBhcnNlcih3b3JrZmxvdylcclxuLy8gICAgICAgIGxvb3AuZ2VuZXJhdGVMb29wKFwiY29udHJvbG5ldFwiLDMpXHJcbi8vICAgICAgICBjb25zb2xlLmxvZyh3b3JrZmxvdylcclxuICAgICAgICBsZXQgcGFyc2VyPW5ldyBDb21meVVJUHJlcGFyc2VyKHdvcmtmbG93KVxyXG4gICAgICAgIGF3YWl0IHBhcnNlci5leGVjdXRlKHBhcnNlci5nZXRUZXN0RGF0YSgpKVxyXG4gICAgICAgIHdpbmRvdy5hcHAubG9hZEdyYXBoRGF0YSh3b3JrZmxvdyk7XHJcbiAgICAgICAgJG1ldGFkYXRhPXdvcmtmbG93LmV4dHJhLmd5cmVcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHNob3dTdHJ1Y3R1cmUoKSB7XHJcbiAgICAgICAgbGV0IHdvcmtmbG93PXdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplKClcclxuICAgICAgICBjb25zb2xlLmxvZyh3b3JrZmxvdylcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBnZXRWaXJ0dWFsTm9kZXMoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBvdXRlck5vZGUgb2YgIHdpbmRvdy5hcHAuZ3JhcGguY29tcHV0ZUV4ZWN1dGlvbk9yZGVyKGZhbHNlKSkge1xyXG4gICAgICAgICAgICBjb25zdCBpbm5lck5vZGVzID0gb3V0ZXJOb2RlLmdldElubmVyTm9kZXMgPyBvdXRlck5vZGUuZ2V0SW5uZXJOb2RlcygpIDogW291dGVyTm9kZV07XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBpbm5lck5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pc1ZpcnR1YWxOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlydHVhbE5vZGVzLnB1c2gobm9kZS50eXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gc2F2ZVdvcmtmbG93KCkge1xyXG4gICAgLy8gICAgY29uc29sZS5sb2coXCJzYXZlV29ya2Zsb3dcIik7XHJcbiAgICAgICAgbGV0IGhlbHBlcj1uZXcgbWFwcGluZ3NIZWxwZXIoKVxyXG4gICAgICAgIGhlbHBlci5jbGVhblVwTWFwcGluZ3MoJG1ldGFkYXRhKVxyXG4gICAgICAgIGdldFZpcnR1YWxOb2RlcygpO1xyXG4gICAgICAgIHdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplX3dpZGdldHM9dHJ1ZVxyXG4gICAgICAgIGxldCBncmFwaCA9IHdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplKCk7XHJcblxyXG4gICAgICAgIC8vaWYgKCEkbWV0YWRhdGEudmlydHVhbE5vZGVzIHx8ICgkbWV0YWRhdGEudmlydHVhbE5vZGVzICYmICEkbWV0YWRhdGEudmlydHVhbE5vZGVzLmxlbmd0aCkpe1xyXG4gICAgICAgICAgICB2aXJ0dWFsTm9kZXM9IFsuLi5uZXcgU2V0KHZpcnR1YWxOb2RlcyldO1xyXG4gICAgICAgICAgICAkbWV0YWRhdGEudmlydHVhbE5vZGVzPXZpcnR1YWxOb2RlcztcclxuICAgICAgICAvL31cclxuICAgICAgICBmb3IobGV0IGk9MDtpPGdyYXBoLm5vZGVzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU9Z3JhcGgubm9kZXNbaV1cclxuICAgICAgICAgICAgbGV0IF9ub2RlPXdpbmRvdy5hcHAuZ3JhcGguX25vZGVzW2ldXHJcbiAgICAgICAgICAgIGlmICghJG1ldGFkYXRhLm5vZGVXaWRnZXRzKSAkbWV0YWRhdGEubm9kZVdpZGdldHM9e31cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGltYWdlIGxpc3QgZnJvbSB2YWx1ZXNcclxuICAgICAgICAgICAgaWYgIChfbm9kZSAmJiBfbm9kZS53aWRnZXRzIT12b2lkIDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXd3aWRnZXRzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShfbm9kZS53aWRnZXRzKSk7XHJcbiAgICAgICAgICAgICAgICBuZXd3aWRnZXRzLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLm5hbWUgPT0gJ2ltYWdlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5vcHRpb25zLnZhbHVlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAkbWV0YWRhdGEubm9kZVdpZGdldHNbbm9kZS5pZF0gPSBuZXd3aWRnZXRzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIC8vICAgbm9kZS53aWRnZXRzPV9ub2RlLndpZGdldHNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHRoaXMgaXMgc2NlbmFyaW8ganVzdCBhZnRlciBsb2FkaW5nIHdvcmtmbG93IGFuZCBub3Qgc2F2ZSBpdFxyXG4gICAgICAgIGlmIChsb2FkZWR3b3JrZmxvdyAmJiBsb2FkZWR3b3JrZmxvdy5leHRyYS53b3Jrc3BhY2VfaW5mbykge1xyXG4gICAgICAgICAgICBncmFwaC5leHRyYSA9IGxvYWRlZHdvcmtmbG93LmV4dHJhO1xyXG4gICAgICAgICAgICAkbWV0YWRhdGEgPSBsb2FkZWR3b3JrZmxvdy5leHRyYS5neXJlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2FkZWR3b3JrZmxvdyA9IG51bGw7XHJcbiAgICAgICAgbGV0IGZpbGVfcGF0aCA9IGdyYXBoLmV4dHJhPy53b3Jrc3BhY2VfaW5mbz8ubmFtZSB8fCBcIm5ldy5qc29uXCI7XHJcbiAgICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgZmlsZV9wYXRoID0gbmFtZVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNhdmUgZmlsZTogXCIsZmlsZV9wYXRoLFwibmFtZTogXCIsbmFtZSxcImd5cmVuYW1lOiBcIixncmFwaC5leHRyYT8ud29ya3NwYWNlX2luZm8/Lm5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIWZpbGVfcGF0aC5lbmRzV2l0aCgnLmpzb24nKSkge1xyXG4gICAgICAgICAgICAvLyBBZGQgLmpzb24gZXh0ZW5zaW9uIGlmIGl0IGRvZXNuJ3QgZXhpc3RcclxuICAgICAgICAgICAgZmlsZV9wYXRoICs9ICcuanNvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkbWV0YWRhdGEgJiYgZ3JhcGguZXh0cmEpIGdyYXBoLmV4dHJhLmd5cmUgPSAkbWV0YWRhdGE7XHJcbiAgICAgICAgY29uc3QgZ3JhcGhKc29uID0gSlNPTi5zdHJpbmdpZnkoZ3JhcGgpO1xyXG5cclxuICAgICAgICBpZihvcmdpbmFsbmFtZSAhPSBuYW1lICYmICFkdXBsaWNhdGUpIHtcclxuICAgICAgICAgICAgbGV0IG5ld19maWxlX3BhdGg7XHJcbiAgICAgICAgICAgIGlmIChvcmdpbmFsbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbmV3X2ZpbGVfcGF0aCA9IG9yZ2luYWxuYW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFuZXdfZmlsZV9wYXRoLmVuZHNXaXRoKCcuanNvbicpKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdfZmlsZV9wYXRoICs9ICcuanNvbic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXdhaXQgdXBkYXRlRmlsZShuZXdfZmlsZV9wYXRoLCBncmFwaEpzb24pO1xyXG4gICAgICAgICAgICBhd2FpdCByZW5hbWVGaWxlKG5ld19maWxlX3BhdGgsZmlsZV9wYXRoKVxyXG4gICAgICAgICAgICBkdXBsaWNhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgb3JnaW5hbG5hbWUgPSBuYW1lO1xyXG4gICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgYXdhaXQgdXBkYXRlRmlsZShmaWxlX3BhdGgsIGdyYXBoSnNvbik7XHJcbiAgICAgICAgICAgIGlmKGR1cGxpY2F0ZSl7XHJcbiAgICAgICAgICAgICAgICBvcmdpbmFsbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICBkdXBsaWNhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCBsb2FkTGlzdCgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHJlbmFtZUZpbGUoZmlsZV9wYXRoLCBuZXdfZmlsZV9wYXRoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9neXJlL3JlbmFtZV93b3JrZmxvd2ZpbGVcIiwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZV9wYXRoOiBmaWxlX3BhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3X2ZpbGVfcGF0aDogbmV3X2ZpbGVfcGF0aCxcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcmVuYW1lIC5qc29uIGZpbGU6IFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcmVuYW1lIHdvcmtzcGFjZTpcIiwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVGaWxlKGZpbGVfcGF0aCwganNvbkRhdGEpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2d5cmUvdXBkYXRlX2pzb25fZmlsZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlX3BhdGg6IGZpbGVfcGF0aCxcclxuICAgICAgICAgICAgICAgICAgICBqc29uX3N0cjoganNvbkRhdGEsXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHNhdmluZyB3b3JrZmxvdyAuanNvbiBmaWxlOiBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNhdmluZyB3b3Jrc3BhY2U6XCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gZGVsZXRlRmlsZShmaWxlX3BhdGgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2d5cmUvZGVsZXRlX3dvcmtmbG93X2ZpbGVcIiwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZV9wYXRoOiBmaWxlX3BhdGgsXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGRlbGV0ZSB3b3JrZmxvdyAuanNvbiBmaWxlOiBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNhdmluZyB3b3Jrc3BhY2U6XCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZFRhZygpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGVkVGFnKSByZXR1cm5cclxuICAgICAgICBpZiAoISRtZXRhZGF0YS50YWdzKSAkbWV0YWRhdGEudGFncyA9IFtdXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVGFnPT09XCJMYXllck1lbnVcIikge1xyXG4gICAgICAgICAgICByZW1vdmVUYWcoXCJDb250cm9sTmV0XCIpXHJcbiAgICAgICAgICAgIHJlbW92ZVRhZyhcIlR4dDJJbWFnZVwiKVxyXG4gICAgICAgICAgICByZW1vdmVUYWcoXCJJbnBhaW50aW5nXCIpXHJcbiAgICAgICAgfSBcclxuICAgICAgICBpZiAoc2VsZWN0ZWRUYWc9PT1cIlR4dDJJbWFnZVwiIHx8IHNlbGVjdGVkVGFnPT09XCJJbnBhaW50aW5nXCIgfHwgc2VsZWN0ZWRUYWc9PT1cIkNvbnRyb2xOZXRcIikge1xyXG4gICAgICAgICAgICByZW1vdmVUYWcoXCJMYXllck1lbnVcIilcclxuICAgICAgICB9XHJcbiAgICAgICAgJG1ldGFkYXRhLnRhZ3MucHVzaChzZWxlY3RlZFRhZylcclxuICAgICAgICAkbWV0YWRhdGEgPSAkbWV0YWRhdGFcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVUYWcodGFnKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSAkbWV0YWRhdGEudGFncy5pbmRleE9mKHRhZylcclxuICAgICAgICBpZiAoaW5kZXg8MCkgcmV0dXJuXHJcbiAgICAgICAgJG1ldGFkYXRhLnRhZ3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAkbWV0YWRhdGEgPSAkbWV0YWRhdGFcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZVdvcmtmbG93KHdvcmtmbG93KSB7XHJcbiAgICAgICAgaWYgKGNvbmZpcm0oXCJEZWxldGUgV29ya2Zsb3c/XCIpID09IHRydWUpIHtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSB3b3JrZmxvdy5uYW1lO1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUuZW5kc1dpdGgoJy5qc29uJykpIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgKz0gJy5qc29uJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWxldGVGaWxlKG5hbWUpO1xyXG4gICAgICAgICAgICAkd29ya2Zsb3dMaXN0PSR3b3JrZmxvd0xpc3RcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBkdXBsaWNhdGVXb3JrZmxvdygpIHtcclxuICAgICAgICBuYW1lID0gJ0NvcHkgb2YgJytuYW1lO1xyXG4gICAgICAgICRtZXRhZGF0YS53b3JrZmxvd2lkID0gKE1hdGgucmFuZG9tKCkgKyAxKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgICAgICAkbWV0YWRhdGEudGFncyA9ICRtZXRhZGF0YS50YWdzLmZpbHRlcigoZWwpID0+IGVsICE9ICdEZWZhdWx0Jyk7XHJcbiAgICAgICAgICAgIHJlbW92ZVRhZygnRGVmYXVsdCcpO1xyXG4gICAgICAgIGR1cGxpY2F0ZSA9IHRydWU7XHJcbiAgICAgICAgc2F2ZVdvcmtmbG93KCk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RneXJld29ya2Zsb3dsb2FkZWQnLG5hbWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsZXQgcmVmcmVzaD0wXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVGb3JtKCkge1xyXG4gICAgICAgIGlmIChzdGF0ZSE9PVwiZWRpdEZvcm1cIikgcmV0dXJuXHJcbiAgICAgICAgcmVmcmVzaCsrXHJcblxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVmcmVzaFRhZ3MoZSkge1xyXG4gICAgICAgICRtZXRhZGF0YS50YWdzPWUuZGV0YWlsXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZG93bmxvYWQodGV4dCkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJyxcclxuICAgICAgICAgICAgJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCAnXHJcbiAgICAgICAgICAgICsgZW5jb2RlVVJJQ29tcG9uZW50KHRleHQpKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCAnZm9ybWRhdGEuanNvbicpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICAgICAgZWxlbWVudC5jbGljaygpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkV29ya2Zsb3dGb3JtKGVsZW1lbnQpe1xyXG4gICAgICAgIGxldCBlbGVtID0gJHdvcmtmbG93Zm9ybUxpc3QuZmluZCgoZWwpPT57cmV0dXJuIGVsLm5hbWU9PSdmb3JtZGF0YV8nK2VsZW1lbnQubmFtZX0pO1xyXG4gICAgICAgIGRvd25sb2FkKGVsZW0uanNvbik7XHJcbiAgICB9XHJcbiAgICBhc3luYyBmdW5jdGlvbiBjaGFuZ2VBY3RpdmVEZWFmYXVsdFdvcmtmbG93KGVsZW1lbnQsdHlwZSl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJlbGVtZW50XCIsZWxlbWVudCk7XHJcbiAgICAgICAgYWN0aW9uaWNvbmNsaWNrZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmKHR5cGU9PSdkZWFjdGl2YXRlJyl7XHJcbiAgICAgICAgICAgIGRlYWN0aXZhdGVkd29ya2Zsb3dzLnB1c2goZWxlbWVudC5neXJlLndvcmtmbG93aWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRlYWN0aXZhdGVkd29ya2Zsb3dzID0gZGVhY3RpdmF0ZWR3b3JrZmxvd3MuZmlsdGVyKChlbCk9PmVsIT1lbGVtZW50Lmd5cmUud29ya2Zsb3dpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IHVwZGF0ZURlYWN0aXZhdGVkRGVmYXVsdFdvcmtmbG93cygpO1xyXG4gICAgICAgICR3b3JrZmxvd0xpc3QgPSAkd29ya2Zsb3dMaXN0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsZXQgc2VhcmNoUXVlcnk9XCJcIlxyXG48L3NjcmlwdD5cclxuXHJcbjxkaXYgaWQ9XCJ3b3JrZmxvd01hbmFnZXJcIiBjbGFzcz1cIndvcmtmbG93TWFuYWdlclwiIHN0eWxlPVwibGVmdDoge2xlZnR9cHg7IHRvcDoge3RvcH1weDtcIj5cclxuICA8ZGl2IGNsYXNzPVwibWluaU1lbnVcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vdmVJY29uXCI+XHJcbiAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwibW92ZVwiIG9uOm1vdXNlZG93bj17b25Nb3VzZURvd259PjwvSWNvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlxyXG5cclxuICAgICAgICAgICAgICAgIHsjaWYgIW5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cIkd5cmVcIiBjbGFzcz1cImd5cmVMb2dvXCI+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBvbjpjbGljaz17KGUpID0+IHtmb2xkT3V0PXRydWV9fSBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrXCI+R3lyZTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBvbjpjbGljaz17KGUpID0+IHtmb2xkT3V0PXRydWV9fSBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrXCI+e25hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgeyNpZiAgISRtZXRhZGF0YS50YWdzLmluY2x1ZGVzKCdEZWZhdWx0Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2tcIiBjbGFzcz1cInNhdmVJY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwic2F2ZVwiIG9uOmNsaWNrPXsoZSkgPT4ge3NhdmVXb3JrZmxvdygpfX0gPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIHsjaWYgIWZvbGRPdXR9XHJcbiAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb2xkb3V0XCIgb246Y2xpY2s9eyhlKSA9PiB7Zm9sZE91dD10cnVlfX0+XHJcbiAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZG93blwiPjwvSWNvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBmb2xkT3V0fVxyXG4gICAgeyNpZiBkZWJ1Z31cclxuIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiB7IHRlc3RGaXJzdFBhc3MoKX0gfT5UZXN0PC9idXR0b24+XHJcbiA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4geyBzaG93U3RydWN0dXJlKCl9IH0+V0YgSlNPTjwvYnV0dG9uPlxyXG57L2lmfVxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvbGRvdXRcIiBvbjpjbGljaz17KGUpID0+IHtmb2xkT3V0PWZhbHNlfX0+XHJcbiAgICAgICAgICAgIDxJY29uIG5hbWU9XCJ1cFwiPjwvSWNvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWFpblwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0TWVudVwiPlxyXG4gICAgICAgICAgICB7I2tleSBzdGF0ZX1cclxuICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJsaXN0XCIge3N0YXRlfSBvbjpjbGljaz17IChlKSA9PiAge3N0YXRlPVwibGlzdFwiIH19ID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICB7I2lmICRtZXRhZGF0YSAmJiAkbWV0YWRhdGEubGFzdE1vZGlmaWVkfVxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJwcm9wZXJ0aWVzXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7c3RhdGU9XCJwcm9wZXJ0aWVzXCIgfX0gID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImVkaXRGb3JtXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7c3RhdGU9XCJlZGl0Rm9ybVwiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJlZGl0UnVsZXNcIiB7c3RhdGV9IG9uOmNsaWNrPXthc3luYyAoZSkgPT4gIHtzdGF0ZT1cImVkaXRSdWxlc1wiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJlcnJvcmxvZ3NcIiB7c3RhdGV9IG9uOmNsaWNrPXthc3luYyAoZSkgPT4gIHthd2FpdCBsb2FkTG9nTGlzdCgpOyBzdGF0ZT1cImVycm9ybG9nc1wiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJwcm9wZXJ0aWVzXCIgZGVhY3RpdmF0ZT1cImRlYWN0aXZhdGVcIiAgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZWRpdEZvcm1cIiAgIGRlYWN0aXZhdGU9XCJkZWFjdGl2YXRlXCIgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZWRpdFJ1bGVzXCIgICBkZWFjdGl2YXRlPVwiZGVhY3RpdmF0ZVwiPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZXJyb3Jsb2dzXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7YXdhaXQgbG9hZExvZ0xpc3QoKTsgc3RhdGU9XCJlcnJvcmxvZ3NcIiB9fSAgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiZ3lyZWFwcC9kaXN0L2luZGV4Lmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJHeXJlTGVmdE1lbnVcIj48L0ljb24+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIHsva2V5fVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcblxyXG4gICAgICAgICAgICB7I2lmIHN0YXRlID09PSBcInByb3BlcnRpZXNcIn1cclxuICAgICAgICAgICAgICAgIDxoMT5Xb3JrZmxvdyBQcm9wZXJ0aWVzPC9oMT5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgeyNpZiAgISRtZXRhZGF0YS50YWdzLmluY2x1ZGVzKCdEZWZhdWx0Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5hbWVcIj5OYW1lOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJuYW1lXCIgdHlwZT1cInRleHRcIiBiaW5kOnZhbHVlPXtuYW1lfSBjbGFzcz1cInRleHRfaW5wdXRcIj5cclxuICAgICAgICAgICAgICAgIHs6ZWxzZX1cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLWJvdHRvbToxMHB4XCI+IHtuYW1lfSA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgIHsjaWYgbmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4geyBkdXBsaWNhdGVXb3JrZmxvdygpfSB9PkR1cGxpY2F0ZSBXb3JrZmxvdzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdlZGl0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgeyNpZiAgISRtZXRhZGF0YS50YWdzLmluY2x1ZGVzKCdEZWZhdWx0Jyl9PGRpdiBjbGFzcz1cInRhZ1RpdGxlXCI+Q2xpY2sgb24gYSBUYWcgdG8gcmVtb3ZlIGl0PC9kaXY+ey9pZn1cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7I2lmICRtZXRhZGF0YS50YWdzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjZWFjaCAkbWV0YWRhdGEudGFncyBhcyB0YWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiAgISRtZXRhZGF0YS50YWdzLmluY2x1ZGVzKCdEZWZhdWx0Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdcIiBvbjpjbGljaz17KGUpID0+IHtyZW1vdmVUYWcodGFnKX19Pnt0YWd9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnXCI+e3RhZ308L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIHsjaWYgICEkbWV0YWRhdGEudGFncy5pbmNsdWRlcygnRGVmYXVsdCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwidGFnc2VsZWN0XCIgYmluZDp2YWx1ZT17c2VsZWN0ZWRUYWd9IG9uOmNoYW5nZT17KGUpID0+IHthZGRUYWcoKX19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBzZWxlY3RlZCB2YWx1ZT1cIlwiPkFkZCBUYWcuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjZWFjaCB0YWdzIGFzIHRhZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2lmICRtZXRhZGF0YS50YWdzICYmICEkbWV0YWRhdGEudGFncy5pbmNsdWRlcyh0YWcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwie3RhZ31cIj57dGFnfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgIHsjaWYgICEkbWV0YWRhdGEudGFncy5pbmNsdWRlcygnRGVmYXVsdCcpfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibGljZW5zZVwiPkxpY2Vuc2U6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiaW5wdXQgbGljZW5zZVwiIG5hbWU9XCJsaWNlbnNlXCIgYmluZDp2YWx1ZT17JG1ldGFkYXRhLmxpY2Vuc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHNlbGVjdGVkIHZhbHVlPVwiXCI+U2VsZWN0Li4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQgdmFsdWU9XCJ5ZXNfY29tbWVyY2lhbFwiPkNvbW1lcmNpYWwgYWxsb3dlZDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHNlbGVjdGVkIHZhbHVlPVwibm9uX2NvbW1lcmNpYWxcIj5Ob24gQ29tbWVyY2lhbDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHNlbGVjdGVkIHZhbHVlPVwibmVlZHNfbGljZW5zZVwiPk5lZWRzIGxpY2Vuc2UgZm9yIENvbW1lcmNpYWwgdXNlPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICB7OmVsc2UgaWYgJG1ldGFkYXRhLmxpY2Vuc2V9TGljZW5zZTogeyRtZXRhZGF0YS5saWNlbnNlfVxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dExpbmVcIiA+ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHsjaWYgICEkbWV0YWRhdGEudGFncy5pbmNsdWRlcygnRGVmYXVsdCcpfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImRlc2NyaXB0aW9uXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjp0b3BcIj5EZXNjcmlwdGlvbjo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cInRleHRfaW5wdXRcIiBiaW5kOnZhbHVlPXskbWV0YWRhdGEuZGVzY3JpcHRpb259PjwvdGV4dGFyZWE+ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB7OmVsc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHskbWV0YWRhdGEuZGVzY3JpcHRpb259XHJcbiAgICAgICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dExpbmVcIiA+XHJcbiAgICAgICAgICAgICAgICAgICAgeyNpZiAgISRtZXRhZGF0YS50YWdzLmluY2x1ZGVzKCdEZWZhdWx0Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInlvdXR1YmVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOnRvcFwiPllvdVR1YmU6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJ5b3V0dWJlXCIgY2xhc3M9XCJ0ZXh0X2lucHV0XCIgYmluZDp2YWx1ZT17JG1ldGFkYXRhLnlvdXR1YmV9PiAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB7OmVsc2UgaWYgJG1ldGFkYXRhLnlvdXR1YmV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwieyRtZXRhZGF0YS55b3V0dWJlfVwiIHRhcmdldD1cIl9ibGFua1wiPllvdVR1YmU8L2E+XCJcclxuICAgICAgICAgICAgICAgICAgICB7L2lmfSAgICAgICBcclxuICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXRMaW5lXCIgPlxyXG4gICAgICAgICAgICAgICAgICAgIHsjaWYgICEkbWV0YWRhdGEudGFncy5pbmNsdWRlcygnRGVmYXVsdCcpfVxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjYXRlZ29yeVwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246dG9wXCI+Q2F0ZWdvcnkgKG9ubHkgbGF5ZXIgbWVudSk6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwidGV4dF9pbnB1dFwiIGJpbmQ6dmFsdWU9eyRtZXRhZGF0YS5jYXRlZ29yeX0+ICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHs6ZWxzZSBpZiAkbWV0YWRhdGEuY2F0ZWdvcnl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExheWVyIG1lbnUgY2F0ZWdvcnk6IHskbWV0YWRhdGEuY2F0ZWdvcnl9XHJcbiAgICAgICAgICAgICAgICAgICAgey9pZn0gICAgICAgXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8RWRpdE1vZGVscyBhdmFpbGFibGVNb2RlbHM9e2FsbE1vZGVsc30gbm9fZWRpdD17JG1ldGFkYXRhLnRhZ3MuaW5jbHVkZXMoJ0RlZmF1bHQnKX0gb246ZG93bmxvYWRGaW5pc2hlZD17Z2V0QWxsTW9kZWxzfT48L0VkaXRNb2RlbHM+XHJcbiAgICAgICAgICAgICAgICB7I2lmICRtZXRhZGF0YS53b3JrZmxvd2lkfUlEOiB7JG1ldGFkYXRhLndvcmtmbG93aWR9ey9pZn1cclxuXHJcbiAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsjaWYgc3RhdGUgPT09IFwiZWRpdEZvcm1cIn1cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHhcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxGb3JtQnVpbGRlciB7cmVmcmVzaH0ge2N1c3RvbV91aV9jb21wb25lbnRzfSBvbjpyZWZyZXNoVGFncz17KGUpPT57IHJlZnJlc2hUYWdzKGUpfX0gcG9zWD17cGFyc2VJbnQobGVmdCl9IHBvc1k9e3BhcnNlSW50KHRvcCl9IG5vX2VkaXQ9eyRtZXRhZGF0YS50YWdzLmluY2x1ZGVzKCdEZWZhdWx0Jyl9PjwvRm9ybUJ1aWxkZXI+XHJcbiAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsjaWYgc3RhdGUgPT09IFwiZWRpdFJ1bGVzXCJ9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7I2lmICRtZXRhZGF0YS5mb3JtcyAmJiAkbWV0YWRhdGEuZm9ybXMuZGVmYXVsdCAmJiAkbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50c31cclxuICAgICAgICAgICAgICAgICAgICA8UnVsZUVkaXRvciBub19lZGl0PXskbWV0YWRhdGEudGFncy5pbmNsdWRlcygnRGVmYXVsdCcpfT48L1J1bGVFZGl0b3I+XHJcbiAgICAgICAgICAgICAgICB7OmVsc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgUGxlYXNlIGRlZmluZSBhIGZvcm0gZmlyc3RcclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsjaWYgc3RhdGUgPT09IFwibGlzdFwifVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRlci1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDE+V29ya2Zsb3cgTGlzdDwvaDE+IDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCIgYmluZDp2YWx1ZT17c2VhcmNoUXVlcnl9IGNsYXNzPVwic2VhcmNoUXVlcnlcIj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICB7I2VhY2ggdGFncyBhcyB0YWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246Y2xpY2s9eyAoZSkgPT4geyBhY3RpdmF0ZWRUYWdzW3RhZ109IWFjdGl2YXRlZFRhZ3NbdGFnXTskd29ya2Zsb3dMaXN0PSR3b3JrZmxvd0xpc3R9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6b249e2FjdGl2YXRlZFRhZ3NbdGFnXX0+e3RhZ308L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHsjaWYgd29ya2Zsb3dMaXN0fVxyXG4gICAgICAgICAgICAgICAgICAgIHsjZWFjaCAkd29ya2Zsb3dMaXN0IGFzIHdvcmtmbG93fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7I2lmICFzZWFyY2hRdWVyeSB8fCB3b3JrZmxvdy5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2lmIGlzVmlzaWJsZSh3b3JrZmxvdyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlXCIgY2xhc3M9XCJ3b3JrZmxvd0VudHJ5XCIgb246Y2xpY2s9eyhlKT0+e2xvYWRXb3JrZmxvdyh3b3JrZmxvdyxlKX19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPXsod29ya2Zsb3cubWlzc2luZ05vZGVzIHx8IHdvcmtmbG93Lm1pc3NpbmdNb2RlbHMpID8gJ21pc3NpbmdOb2Rlc09yTW9kZWxzJyA6ICcnfT4ge3dvcmtmbG93Lm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYXN0X2NoYW5nZWRcIj57d29ya2Zsb3cubGFzdE1vZGlmaWVkUmVhZGFibGV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2lmIHdvcmtmbG93Lmd5cmUgJiYgd29ya2Zsb3cuZ3lyZS50YWdzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjZWFjaCB3b3JrZmxvdy5neXJlLnRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnXCI+e3RhZ308L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiAhd29ya2Zsb3cuZGVmYXVsdHdvcmtmbG93fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiAgY2xhc3M9XCJkZWxldGVpY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImRlbGV0ZVwiIG9uOmNsaWNrPXsoZSk9PntkZWxldGVXb3JrZmxvdyh3b3JrZmxvdyl9fT48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey9pZn1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgd29ya2Zsb3cuZGVmYXVsdHdvcmtmbG93fVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgZGVhY3RpdmF0ZWR3b3JrZmxvd3MuaW5jbHVkZXMod29ya2Zsb3cuZ3lyZS53b3JrZmxvd2lkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2ICBjbGFzcz1cImRlbGV0ZWljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImFjdGl2YXRlYmFja1wiIG9uOmNsaWNrPXthc3luYyAoZSkgPT4ge2F3YWl0IGNoYW5nZUFjdGl2ZURlYWZhdWx0V29ya2Zsb3cod29ya2Zsb3csXCJhY3RpdmF0ZVwiKX19ID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgIGNsYXNzPVwiZGVsZXRlaWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZGVhY3RpdmF0ZWRcIiBvbjpjbGljaz0ge2FzeW5jIChlKSA9PiB7YXdhaXQgY2hhbmdlQWN0aXZlRGVhZmF1bHRXb3JrZmxvdyh3b3JrZmxvdyxcImRlYWN0aXZhdGVcIil9fSA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcblxyXG4gICAgICAgICAgICB7L2lmfVxyXG5cclxuICAgICAgICAgICAgeyNpZiBzdGF0ZSA9PT0gXCJlcnJvcmxvZ3NcIn1cclxuICAgICAgICAgICAgICAgIHsjaWYgZGVidWdtb2RlPT0nZXJyb3Jtb2RlJ31cclxuICAgICAgICAgICAgICAgICAgICA8aDE+RXJyb3IgbG9nczwvaDE+XHJcbiAgICAgICAgICAgICAgICB7OmVsc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxPkRlYnVnIGxvZ3M8L2gxPlxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgIDxidXR0b24gIGNsYXNzOmluYWN0aXZlPXtkZWJ1Z21vZGUhPSdlcnJvcm1vZGUnfSBvbjpjbGljaz17YXN5bmMgKGUpID0+IHthd2FpdCBsb2FkTG9nTGlzdCgpOyBkZWJ1Z21vZGU9J2Vycm9ybW9kZSd9IH0+RXJyb3IgTG9nPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzOmluYWN0aXZlPXtkZWJ1Z21vZGUhPSdkZWJ1Z21vZGUnfSBvbjpjbGljaz17YXN5bmMgKGUpID0+IHthd2FpdCBsb2FkTG9nTGlzdCgpOyBkZWJ1Z21vZGU9J2RlYnVnbW9kZSd9IH0+RGVidWcgTG9nPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICAgICAgeyNpZiBkZWJ1Z21vZGU9PSdlcnJvcm1vZGUnfVxyXG4gICAgICAgICAgICAgICAgICAgIHsjaWYgd29ya2Zsb3dMaXN0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7I2VhY2ggJHdvcmtmbG93YXBpTGlzdCBhcyB3b3JrZmxvd31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgaXNWaXNpYmxlKHdvcmtmbG93KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmVcIiBjbGFzcz1cIndvcmtmbG93RW50cnlcIiBvbjpjbGljaz17bG9hZFdvcmtmbG93KHdvcmtmbG93KX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt3b3JrZmxvdy5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG5cclxuICAgICAgICAgICAgICAgIHsjaWYgZGVidWdtb2RlPT0nZGVidWdtb2RlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoICR3b3JrZmxvd2RlYnVnTGlzdCBhcyB3b3JrZmxvd31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgaXNWaXNpYmxlKHdvcmtmbG93KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmVcIiBjbGFzcz1cIndvcmtmbG93RW50cnlcIiBvbjpjbGljaz17bG9hZFdvcmtmbG93KHdvcmtmbG93KX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt3b3JrZmxvdy5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZVwiIGNsYXNzPVwid29ya2Zsb3dFbnRyeVwiIG9uOmNsaWNrPXtsb2FkV29ya2Zsb3dGb3JtKHdvcmtmbG93KX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZvcm0gZGF0YSB7d29ya2Zsb3cubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsvaWZ9XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICB7L2lmfSA8IS0tIGZvbGRPdXQgLS0+XHJcbjwvZGl2PlxyXG48TWFwcGluZ3Mgb246dXBkYXRlRm9ybT17KGUpID0+IHt1cGRhdGVGb3JtKCl9fSA+PC9NYXBwaW5ncz5cclxuXHJcbjxzdmVsdGU6d2luZG93IG9uOm1vdXNldXA9e29uTW91c2VVcH0gb246bW91c2Vtb3ZlPXtvbk1vdXNlTW92ZX0vPlxyXG4gXHJcbjxzdHlsZT5cclxuICAgIEBpbXBvcnQgJ2Rpc3QvYnVpbGQvZ3lyZXN0eWxlcy5jc3MnO1xyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEwMkJJLFFBQVEsMkJBQTJCIn0= */");
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[89] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[89] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[89] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[96] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[96] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[96] = list[i];
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[96] = list[i];
    	return child_ctx;
    }

    // (628:16) {:else}
    function create_else_block_7(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let show_if = !/*$metadata*/ ctx[14].tags.includes('Default');
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = show_if && create_if_block_39(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*name*/ ctx[3]);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "inline-block");
    			add_location(div, file, 629, 20, 22007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_1*/ ctx[41], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*name*/ 8) set_data_dev(t0, /*name*/ ctx[3]);
    			if (dirty[0] & /*$metadata*/ 16384) show_if = !/*$metadata*/ ctx[14].tags.includes('Default');

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*$metadata*/ 16384) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_39(ctx);
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
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_7.name,
    		type: "else",
    		source: "(628:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (624:16) {#if !name}
    function create_if_block_38(ctx) {
    	let icon;
    	let t0;
    	let div;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { name: "Gyre", class: "gyreLogo" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    			t0 = space();
    			div = element("div");
    			div.textContent = "Gyre";
    			set_style(div, "display", "inline-block");
    			add_location(div, file, 626, 20, 21805);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[40], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_38.name,
    		type: "if",
    		source: "(624:16) {#if !name}",
    		ctx
    	});

    	return block;
    }

    // (631:20) {#if  !$metadata.tags.includes('Default')}
    function create_if_block_39(ctx) {
    	let div;
    	let icon;
    	let current;
    	icon = new Icon({ props: { name: "save" }, $$inline: true });
    	icon.$on("click", /*click_handler_2*/ ctx[42]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			set_style(div, "display", "inline-block");
    			attr_dev(div, "class", "saveIcon");
    			add_location(div, file, 631, 24, 22176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_39.name,
    		type: "if",
    		source: "(631:20) {#if  !$metadata.tags.includes('Default')}",
    		ctx
    	});

    	return block;
    }

    // (640:4) {#if !foldOut}
    function create_if_block_37(ctx) {
    	let div;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { name: "down" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "foldout");
    			add_location(div, file, 641, 12, 22549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_3*/ ctx[43], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_37.name,
    		type: "if",
    		source: "(640:4) {#if !foldOut}",
    		ctx
    	});

    	return block;
    }

    // (646:4) {#if foldOut}
    function create_if_block(ctx) {
    	let t0;
    	let div0;
    	let icon;
    	let t1;
    	let div3;
    	let div1;
    	let previous_key = /*state*/ ctx[4];
    	let t2;
    	let div2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*debug*/ ctx[22] && create_if_block_36(ctx);
    	icon = new Icon({ props: { name: "up" }, $$inline: true });
    	let key_block = create_key_block(ctx);
    	let if_block1 = /*state*/ ctx[4] === "properties" && create_if_block_19(ctx);
    	let if_block2 = /*state*/ ctx[4] === "editForm" && create_if_block_18(ctx);
    	let if_block3 = /*state*/ ctx[4] === "editRules" && create_if_block_16(ctx);
    	let if_block4 = /*state*/ ctx[4] === "list" && create_if_block_8(ctx);
    	let if_block5 = /*state*/ ctx[4] === "errorlogs" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			key_block.c();
    			t2 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			attr_dev(div0, "class", "foldout");
    			add_location(div0, file, 651, 8, 22923);
    			attr_dev(div1, "class", "leftMenu");
    			add_location(div1, file, 655, 8, 23069);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file, 674, 8, 24316);
    			attr_dev(div3, "class", "main");
    			add_location(div3, file, 654, 8, 23041);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			mount_component(icon, div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			key_block.m(div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t4);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t5);
    			if (if_block4) if_block4.m(div2, null);
    			append_dev(div2, t6);
    			if (if_block5) if_block5.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_6*/ ctx[46], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*debug*/ ctx[22]) if_block0.p(ctx, dirty);

    			if (dirty[0] & /*state*/ 16 && safe_not_equal(previous_key, previous_key = /*state*/ ctx[4])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(div1, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			if (/*state*/ ctx[4] === "properties") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_19(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[4] === "editForm") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_18(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, t4);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[4] === "editRules") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_16(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div2, t5);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[4] === "list") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_8(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div2, t6);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[4] === "errorlogs") {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_1(ctx);
    					if_block5.c();
    					if_block5.m(div2, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(key_block);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(key_block);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			destroy_component(icon);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			key_block.d(detaching);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(646:4) {#if foldOut}",
    		ctx
    	});

    	return block;
    }

    // (647:4) {#if debug}
    function create_if_block_36(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Test";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "WF JSON";
    			add_location(button0, file, 647, 1, 22716);
    			add_location(button1, file, 648, 1, 22778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_4*/ ctx[44], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_5*/ ctx[45], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_36.name,
    		type: "if",
    		source: "(647:4) {#if debug}",
    		ctx
    	});

    	return block;
    }

    // (664:16) {:else}
    function create_else_block_6(ctx) {
    	let icon0;
    	let t0;
    	let icon1;
    	let t1;
    	let icon2;
    	let t2;
    	let icon3;
    	let current;

    	icon0 = new Icon({
    			props: {
    				name: "properties",
    				deactivate: "deactivate"
    			},
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				name: "editForm",
    				deactivate: "deactivate"
    			},
    			$$inline: true
    		});

    	icon2 = new Icon({
    			props: {
    				name: "editRules",
    				deactivate: "deactivate"
    			},
    			$$inline: true
    		});

    	icon3 = new Icon({
    			props: {
    				name: "errorlogs",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon3.$on("click", /*click_handler_12*/ ctx[52]);

    	const block = {
    		c: function create() {
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			create_component(icon1.$$.fragment);
    			t1 = space();
    			create_component(icon2.$$.fragment);
    			t2 = space();
    			create_component(icon3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(icon1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(icon2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(icon3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon3_changes = {};
    			if (dirty[0] & /*state*/ 16) icon3_changes.state = /*state*/ ctx[4];
    			icon3.$set(icon3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			transition_in(icon3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			transition_out(icon3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(icon1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(icon2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(icon3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_6.name,
    		type: "else",
    		source: "(664:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (659:16) {#if $metadata && $metadata.lastModified}
    function create_if_block_35(ctx) {
    	let icon0;
    	let t0;
    	let icon1;
    	let t1;
    	let icon2;
    	let t2;
    	let icon3;
    	let current;

    	icon0 = new Icon({
    			props: {
    				name: "properties",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon0.$on("click", /*click_handler_8*/ ctx[48]);

    	icon1 = new Icon({
    			props: {
    				name: "editForm",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon1.$on("click", /*click_handler_9*/ ctx[49]);

    	icon2 = new Icon({
    			props: {
    				name: "editRules",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon2.$on("click", /*click_handler_10*/ ctx[50]);

    	icon3 = new Icon({
    			props: {
    				name: "errorlogs",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon3.$on("click", /*click_handler_11*/ ctx[51]);

    	const block = {
    		c: function create() {
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			create_component(icon1.$$.fragment);
    			t1 = space();
    			create_component(icon2.$$.fragment);
    			t2 = space();
    			create_component(icon3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(icon1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(icon2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(icon3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon0_changes = {};
    			if (dirty[0] & /*state*/ 16) icon0_changes.state = /*state*/ ctx[4];
    			icon0.$set(icon0_changes);
    			const icon1_changes = {};
    			if (dirty[0] & /*state*/ 16) icon1_changes.state = /*state*/ ctx[4];
    			icon1.$set(icon1_changes);
    			const icon2_changes = {};
    			if (dirty[0] & /*state*/ 16) icon2_changes.state = /*state*/ ctx[4];
    			icon2.$set(icon2_changes);
    			const icon3_changes = {};
    			if (dirty[0] & /*state*/ 16) icon3_changes.state = /*state*/ ctx[4];
    			icon3.$set(icon3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			transition_in(icon3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			transition_out(icon3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(icon1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(icon2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(icon3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_35.name,
    		type: "if",
    		source: "(659:16) {#if $metadata && $metadata.lastModified}",
    		ctx
    	});

    	return block;
    }

    // (657:12) {#key state}
    function create_key_block(ctx) {
    	let icon0;
    	let t0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let a;
    	let icon1;
    	let current;

    	icon0 = new Icon({
    			props: { name: "list", state: /*state*/ ctx[4] },
    			$$inline: true
    		});

    	icon0.$on("click", /*click_handler_7*/ ctx[47]);
    	const if_block_creators = [create_if_block_35, create_else_block_6];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$metadata*/ ctx[14] && /*$metadata*/ ctx[14].lastModified) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	icon1 = new Icon({
    			props: { name: "GyreLeftMenu" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			a = element("a");
    			create_component(icon1.$$.fragment);
    			attr_dev(a, "href", "gyreapp/dist/index.html");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file, 669, 16, 24147);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a, anchor);
    			mount_component(icon1, a, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon0_changes = {};
    			if (dirty[0] & /*state*/ 16) icon0_changes.state = /*state*/ ctx[4];
    			icon0.$set(icon0_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(t1.parentNode, t1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon0, detaching);
    			if (detaching) detach_dev(t0);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a);
    			destroy_component(icon1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(657:12) {#key state}",
    		ctx
    	});

    	return block;
    }

    // (677:12) {#if state === "properties"}
    function create_if_block_19(ctx) {
    	let h1;
    	let t1;
    	let show_if_6;
    	let t2;
    	let t3;
    	let div1;
    	let show_if_5 = !/*$metadata*/ ctx[14].tags.includes('Default');
    	let t4;
    	let div0;
    	let t5;
    	let show_if_4 = !/*$metadata*/ ctx[14].tags.includes('Default');
    	let t6;
    	let show_if_3;
    	let t7;
    	let div2;
    	let show_if_2;
    	let t8;
    	let div3;
    	let show_if_1;
    	let t9;
    	let div4;
    	let show_if;
    	let t10;
    	let editmodels;
    	let t11;
    	let if_block9_anchor;
    	let current;

    	function select_block_type_2(ctx, dirty) {
    		if (dirty[0] & /*$metadata*/ 16384) show_if_6 = null;
    		if (show_if_6 == null) show_if_6 = !!!/*$metadata*/ ctx[14].tags.includes('Default');
    		if (show_if_6) return create_if_block_34;
    		return create_else_block_5;
    	}

    	let current_block_type = select_block_type_2(ctx, [-1, -1, -1, -1]);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*name*/ ctx[3] && create_if_block_33(ctx);
    	let if_block2 = show_if_5 && create_if_block_32(ctx);
    	let if_block3 = /*$metadata*/ ctx[14].tags && create_if_block_30(ctx);
    	let if_block4 = show_if_4 && create_if_block_28(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (dirty[0] & /*$metadata*/ 16384) show_if_3 = null;
    		if (show_if_3 == null) show_if_3 = !!!/*$metadata*/ ctx[14].tags.includes('Default');
    		if (show_if_3) return create_if_block_26;
    		if (/*$metadata*/ ctx[14].license) return create_if_block_27;
    	}

    	let current_block_type_1 = select_block_type_4(ctx, [-1, -1, -1, -1]);
    	let if_block5 = current_block_type_1 && current_block_type_1(ctx);

    	function select_block_type_5(ctx, dirty) {
    		if (dirty[0] & /*$metadata*/ 16384) show_if_2 = null;
    		if (show_if_2 == null) show_if_2 = !!!/*$metadata*/ ctx[14].tags.includes('Default');
    		if (show_if_2) return create_if_block_25;
    		return create_else_block_3;
    	}

    	let current_block_type_2 = select_block_type_5(ctx, [-1, -1, -1, -1]);
    	let if_block6 = current_block_type_2(ctx);

    	function select_block_type_6(ctx, dirty) {
    		if (dirty[0] & /*$metadata*/ 16384) show_if_1 = null;
    		if (show_if_1 == null) show_if_1 = !!!/*$metadata*/ ctx[14].tags.includes('Default');
    		if (show_if_1) return create_if_block_23;
    		if (/*$metadata*/ ctx[14].youtube) return create_if_block_24;
    	}

    	let current_block_type_3 = select_block_type_6(ctx, [-1, -1, -1, -1]);
    	let if_block7 = current_block_type_3 && current_block_type_3(ctx);

    	function select_block_type_7(ctx, dirty) {
    		if (dirty[0] & /*$metadata*/ 16384) show_if = null;
    		if (show_if == null) show_if = !!!/*$metadata*/ ctx[14].tags.includes('Default');
    		if (show_if) return create_if_block_21;
    		if (/*$metadata*/ ctx[14].category) return create_if_block_22;
    	}

    	let current_block_type_4 = select_block_type_7(ctx, [-1, -1, -1, -1]);
    	let if_block8 = current_block_type_4 && current_block_type_4(ctx);

    	editmodels = new EditModels({
    			props: {
    				availableModels: /*allModels*/ ctx[9],
    				no_edit: /*$metadata*/ ctx[14].tags.includes('Default')
    			},
    			$$inline: true
    		});

    	editmodels.$on("downloadFinished", /*getAllModels*/ ctx[28]);
    	let if_block9 = /*$metadata*/ ctx[14].workflowid && create_if_block_20(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Workflow Properties";
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div1 = element("div");
    			if (if_block2) if_block2.c();
    			t4 = space();
    			div0 = element("div");
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			div2 = element("div");
    			if_block6.c();
    			t8 = space();
    			div3 = element("div");
    			if (if_block7) if_block7.c();
    			t9 = space();
    			div4 = element("div");
    			if (if_block8) if_block8.c();
    			t10 = space();
    			create_component(editmodels.$$.fragment);
    			t11 = space();
    			if (if_block9) if_block9.c();
    			if_block9_anchor = empty();
    			add_location(h1, file, 677, 16, 24399);
    			attr_dev(div0, "class", "tags");
    			add_location(div0, file, 691, 20, 25120);
    			attr_dev(div1, "class", "tagedit");
    			add_location(div1, file, 689, 16, 24953);
    			attr_dev(div2, "class", "inputLine");
    			add_location(div2, file, 726, 16, 27123);
    			attr_dev(div3, "class", "inputLine");
    			add_location(div3, file, 736, 16, 27596);
    			attr_dev(div4, "class", "inputLine");
    			add_location(div4, file, 745, 16, 28120);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div1, t5);
    			if (if_block4) if_block4.m(div1, null);
    			insert_dev(target, t6, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div2, anchor);
    			if_block6.m(div2, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div3, anchor);
    			if (if_block7) if_block7.m(div3, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div4, anchor);
    			if (if_block8) if_block8.m(div4, null);
    			insert_dev(target, t10, anchor);
    			mount_component(editmodels, target, anchor);
    			insert_dev(target, t11, anchor);
    			if (if_block9) if_block9.m(target, anchor);
    			insert_dev(target, if_block9_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx, dirty)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t2.parentNode, t2);
    				}
    			}

    			if (/*name*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_33(ctx);
    					if_block1.c();
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*$metadata*/ 16384) show_if_5 = !/*$metadata*/ ctx[14].tags.includes('Default');

    			if (show_if_5) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_32(ctx);
    					if_block2.c();
    					if_block2.m(div1, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*$metadata*/ ctx[14].tags) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_30(ctx);
    					if_block3.c();
    					if_block3.m(div0, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty[0] & /*$metadata*/ 16384) show_if_4 = !/*$metadata*/ ctx[14].tags.includes('Default');

    			if (show_if_4) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_28(ctx);
    					if_block4.c();
    					if_block4.m(div1, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_4(ctx, dirty)) && if_block5) {
    				if_block5.p(ctx, dirty);
    			} else {
    				if (if_block5) if_block5.d(1);
    				if_block5 = current_block_type_1 && current_block_type_1(ctx);

    				if (if_block5) {
    					if_block5.c();
    					if_block5.m(t7.parentNode, t7);
    				}
    			}

    			if (current_block_type_2 === (current_block_type_2 = select_block_type_5(ctx, dirty)) && if_block6) {
    				if_block6.p(ctx, dirty);
    			} else {
    				if_block6.d(1);
    				if_block6 = current_block_type_2(ctx);

    				if (if_block6) {
    					if_block6.c();
    					if_block6.m(div2, null);
    				}
    			}

    			if (current_block_type_3 === (current_block_type_3 = select_block_type_6(ctx, dirty)) && if_block7) {
    				if_block7.p(ctx, dirty);
    			} else {
    				if (if_block7) if_block7.d(1);
    				if_block7 = current_block_type_3 && current_block_type_3(ctx);

    				if (if_block7) {
    					if_block7.c();
    					if_block7.m(div3, null);
    				}
    			}

    			if (current_block_type_4 === (current_block_type_4 = select_block_type_7(ctx, dirty)) && if_block8) {
    				if_block8.p(ctx, dirty);
    			} else {
    				if (if_block8) if_block8.d(1);
    				if_block8 = current_block_type_4 && current_block_type_4(ctx);

    				if (if_block8) {
    					if_block8.c();
    					if_block8.m(div4, null);
    				}
    			}

    			const editmodels_changes = {};
    			if (dirty[0] & /*allModels*/ 512) editmodels_changes.availableModels = /*allModels*/ ctx[9];
    			if (dirty[0] & /*$metadata*/ 16384) editmodels_changes.no_edit = /*$metadata*/ ctx[14].tags.includes('Default');
    			editmodels.$set(editmodels_changes);

    			if (/*$metadata*/ ctx[14].workflowid) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_20(ctx);
    					if_block9.c();
    					if_block9.m(if_block9_anchor.parentNode, if_block9_anchor);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editmodels.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editmodels.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (detaching) detach_dev(t6);

    			if (if_block5) {
    				if_block5.d(detaching);
    			}

    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div2);
    			if_block6.d();
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div3);

    			if (if_block7) {
    				if_block7.d();
    			}

    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div4);

    			if (if_block8) {
    				if_block8.d();
    			}

    			if (detaching) detach_dev(t10);
    			destroy_component(editmodels, detaching);
    			if (detaching) detach_dev(t11);
    			if (if_block9) if_block9.d(detaching);
    			if (detaching) detach_dev(if_block9_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_19.name,
    		type: "if",
    		source: "(677:12) {#if state === \\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (683:16) {:else}
    function create_else_block_5(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*name*/ ctx[3]);
    			set_style(div, "margin-bottom", "10px");
    			add_location(div, file, 683, 20, 24695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*name*/ 8) set_data_dev(t, /*name*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(683:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (680:16) {#if  !$metadata.tags.includes('Default')}
    function create_if_block_34(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Name:";
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "for", "name");
    			add_location(label, file, 680, 20, 24527);
    			attr_dev(input, "name", "name");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "text_input");
    			add_location(input, file, 681, 20, 24580);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*name*/ ctx[3]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[53]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*name*/ 8 && input.value !== /*name*/ ctx[3]) {
    				set_input_value(input, /*name*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_34.name,
    		type: "if",
    		source: "(680:16) {#if  !$metadata.tags.includes('Default')}",
    		ctx
    	});

    	return block;
    }

    // (687:16) {#if name}
    function create_if_block_33(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Duplicate Workflow";
    			add_location(button, file, 687, 20, 24835);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_13*/ ctx[54], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_33.name,
    		type: "if",
    		source: "(687:16) {#if name}",
    		ctx
    	});

    	return block;
    }

    // (691:20) {#if  !$metadata.tags.includes('Default')}
    function create_if_block_32(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Click on a Tag to remove it";
    			attr_dev(div, "class", "tagTitle");
    			add_location(div, file, 690, 62, 25038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_32.name,
    		type: "if",
    		source: "(691:20) {#if  !$metadata.tags.includes('Default')}",
    		ctx
    	});

    	return block;
    }

    // (693:24) {#if $metadata.tags}
    function create_if_block_30(ctx) {
    	let each_1_anchor;
    	let each_value_6 = /*$metadata*/ ctx[14].tags;
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
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
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384 | dirty[1] & /*removeTag*/ 4) {
    				each_value_6 = /*$metadata*/ ctx[14].tags;
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_6.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_30.name,
    		type: "if",
    		source: "(693:24) {#if $metadata.tags}",
    		ctx
    	});

    	return block;
    }

    // (698:32) {:else}
    function create_else_block_4(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[96] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 698, 36, 25585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384 && t_value !== (t_value = /*tag*/ ctx[96] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(698:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (696:32) {#if  !$metadata.tags.includes('Default')}
    function create_if_block_31(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[96] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_14(...args) {
    		return /*click_handler_14*/ ctx[55](/*tag*/ ctx[96], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 696, 36, 25443);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_14, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$metadata*/ 16384 && t_value !== (t_value = /*tag*/ ctx[96] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_31.name,
    		type: "if",
    		source: "(696:32) {#if  !$metadata.tags.includes('Default')}",
    		ctx
    	});

    	return block;
    }

    // (695:28) {#each $metadata.tags as tag}
    function create_each_block_6(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (dirty[0] & /*$metadata*/ 16384) show_if = null;
    		if (show_if == null) show_if = !!!/*$metadata*/ ctx[14].tags.includes('Default');
    		if (show_if) return create_if_block_31;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_3(ctx, [-1, -1, -1, -1]);
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
    			if (current_block_type === (current_block_type = select_block_type_3(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(695:28) {#each $metadata.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (704:20) {#if  !$metadata.tags.includes('Default')}
    function create_if_block_28(ctx) {
    	let select;
    	let option;
    	let mounted;
    	let dispose;
    	let each_value_5 = /*tags*/ ctx[17];
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			option = element("option");
    			option.textContent = "Add Tag...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			option.selected = true;
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file, 705, 28, 25949);
    			attr_dev(select, "class", "tagselect");
    			if (/*selectedTag*/ ctx[6] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[56].call(select));
    			add_location(select, file, 704, 24, 25838);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*selectedTag*/ ctx[6], true);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[56]),
    					listen_dev(select, "change", /*change_handler*/ ctx[57], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*tags, $metadata*/ 147456) {
    				each_value_5 = /*tags*/ ctx[17];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}

    			if (dirty[0] & /*selectedTag, tags*/ 131136) {
    				select_option(select, /*selectedTag*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_28.name,
    		type: "if",
    		source: "(704:20) {#if  !$metadata.tags.includes('Default')}",
    		ctx
    	});

    	return block;
    }

    // (708:32) {#if $metadata.tags && !$metadata.tags.includes(tag)}
    function create_if_block_29(ctx) {
    	let option;
    	let t_value = /*tag*/ ctx[96] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*tag*/ ctx[96];
    			option.value = option.__value;
    			add_location(option, file, 708, 36, 26168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_29.name,
    		type: "if",
    		source: "(708:32) {#if $metadata.tags && !$metadata.tags.includes(tag)}",
    		ctx
    	});

    	return block;
    }

    // (707:28) {#each tags as tag}
    function create_each_block_5(ctx) {
    	let show_if = /*$metadata*/ ctx[14].tags && !/*$metadata*/ ctx[14].tags.includes(/*tag*/ ctx[96]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_29(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384) show_if = /*$metadata*/ ctx[14].tags && !/*$metadata*/ ctx[14].tags.includes(/*tag*/ ctx[96]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_29(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(707:28) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (725:44) 
    function create_if_block_27(ctx) {
    	let t0;
    	let t1_value = /*$metadata*/ ctx[14].license + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("License: ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384 && t1_value !== (t1_value = /*$metadata*/ ctx[14].license + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_27.name,
    		type: "if",
    		source: "(725:44) ",
    		ctx
    	});

    	return block;
    }

    // (716:17) {#if  !$metadata.tags.includes('Default')}
    function create_if_block_26(ctx) {
    	let label;
    	let t1;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "License:";
    			t1 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Select...";
    			option1 = element("option");
    			option1.textContent = "Commercial allowed";
    			option2 = element("option");
    			option2.textContent = "Non Commercial";
    			option3 = element("option");
    			option3.textContent = "Needs license for Commercial use";
    			attr_dev(label, "for", "license");
    			add_location(label, file, 717, 20, 26484);
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file, 719, 24, 26645);
    			option1.selected = true;
    			option1.__value = "yes_commercial";
    			option1.value = option1.__value;
    			add_location(option1, file, 720, 24, 26715);
    			option2.selected = true;
    			option2.__value = "non_commercial";
    			option2.value = option2.__value;
    			add_location(option2, file, 721, 24, 26808);
    			option3.selected = true;
    			option3.__value = "needs_license";
    			option3.value = option3.__value;
    			add_location(option3, file, 722, 24, 26897);
    			attr_dev(select, "class", "input license");
    			attr_dev(select, "name", "license");
    			if (/*$metadata*/ ctx[14].license === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[58].call(select));
    			add_location(select, file, 718, 20, 26543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select, anchor);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			select_option(select, /*$metadata*/ ctx[14].license, true);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler_1*/ ctx[58]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384) {
    				select_option(select, /*$metadata*/ ctx[14].license);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_26.name,
    		type: "if",
    		source: "(716:17) {#if  !$metadata.tags.includes('Default')}",
    		ctx
    	});

    	return block;
    }

    // (732:20) {:else}
    function create_else_block_3(ctx) {
    	let t_value = /*$metadata*/ ctx[14].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384 && t_value !== (t_value = /*$metadata*/ ctx[14].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(732:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (728:20) {#if  !$metadata.tags.includes('Default')}
    function create_if_block_25(ctx) {
    	let label;
    	let t1;
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Description:";
    			t1 = space();
    			textarea = element("textarea");
    			attr_dev(label, "for", "description");
    			set_style(label, "vertical-align", "top");
    			add_location(label, file, 729, 20, 27255);
    			attr_dev(textarea, "class", "text_input");
    			add_location(textarea, file, 730, 23, 27352);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*$metadata*/ ctx[14].description);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[59]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384) {
    				set_input_value(textarea, /*$metadata*/ ctx[14].description);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_25.name,
    		type: "if",
    		source: "(728:20) {#if  !$metadata.tags.includes('Default')}",
    		ctx
    	});

    	return block;
    }

    // (741:48) 
    function create_if_block_24(ctx) {
    	let a;
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text("YouTube");
    			t1 = text("\"");
    			attr_dev(a, "href", a_href_value = /*$metadata*/ ctx[14].youtube);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file, 741, 25, 27968);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384 && a_href_value !== (a_href_value = /*$metadata*/ ctx[14].youtube)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_24.name,
    		type: "if",
    		source: "(741:48) ",
    		ctx
    	});

    	return block;
    }

    // (738:20) {#if  !$metadata.tags.includes('Default')}
    function create_if_block_23(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "YouTube:";
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "for", "youtube");
    			set_style(label, "vertical-align", "top");
    			add_location(label, file, 738, 20, 27706);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "youtube");
    			attr_dev(input, "class", "text_input");
    			add_location(input, file, 739, 25, 27797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*$metadata*/ ctx[14].youtube);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[60]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384 && input.value !== /*$metadata*/ ctx[14].youtube) {
    				set_input_value(input, /*$metadata*/ ctx[14].youtube);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_23.name,
    		type: "if",
    		source: "(738:20) {#if  !$metadata.tags.includes('Default')}",
    		ctx
    	});

    	return block;
    }

    // (750:49) 
    function create_if_block_22(ctx) {
    	let t0;
    	let t1_value = /*$metadata*/ ctx[14].category + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Layer menu category: ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384 && t1_value !== (t1_value = /*$metadata*/ ctx[14].category + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_22.name,
    		type: "if",
    		source: "(750:49) ",
    		ctx
    	});

    	return block;
    }

    // (747:20) {#if  !$metadata.tags.includes('Default')}
    function create_if_block_21(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Category (only layer menu):";
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "for", "category");
    			set_style(label, "vertical-align", "top");
    			add_location(label, file, 747, 20, 28230);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "text_input");
    			add_location(input, file, 748, 25, 28341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*$metadata*/ ctx[14].category);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[61]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384 && input.value !== /*$metadata*/ ctx[14].category) {
    				set_input_value(input, /*$metadata*/ ctx[14].category);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21.name,
    		type: "if",
    		source: "(747:20) {#if  !$metadata.tags.includes('Default')}",
    		ctx
    	});

    	return block;
    }

    // (755:16) {#if $metadata.workflowid}
    function create_if_block_20(ctx) {
    	let t0;
    	let t1_value = /*$metadata*/ ctx[14].workflowid + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("ID: ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16384 && t1_value !== (t1_value = /*$metadata*/ ctx[14].workflowid + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_20.name,
    		type: "if",
    		source: "(755:16) {#if $metadata.workflowid}",
    		ctx
    	});

    	return block;
    }

    // (758:12) {#if state === "editForm"}
    function create_if_block_18(ctx) {
    	let div;
    	let t;
    	let formbuilder;
    	let current;

    	formbuilder = new FormBuilder({
    			props: {
    				refresh: /*refresh*/ ctx[11],
    				custom_ui_components: /*custom_ui_components*/ ctx[10],
    				posX: parseInt(/*left*/ ctx[0]),
    				posY: parseInt(/*top*/ ctx[1]),
    				no_edit: /*$metadata*/ ctx[14].tags.includes('Default')
    			},
    			$$inline: true
    		});

    	formbuilder.$on("refreshTags", /*refreshTags_handler*/ ctx[62]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			create_component(formbuilder.$$.fragment);
    			set_style(div, "margin-top", "10px");
    			add_location(div, file, 758, 16, 28918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(formbuilder, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formbuilder_changes = {};
    			if (dirty[0] & /*refresh*/ 2048) formbuilder_changes.refresh = /*refresh*/ ctx[11];
    			if (dirty[0] & /*custom_ui_components*/ 1024) formbuilder_changes.custom_ui_components = /*custom_ui_components*/ ctx[10];
    			if (dirty[0] & /*left*/ 1) formbuilder_changes.posX = parseInt(/*left*/ ctx[0]);
    			if (dirty[0] & /*top*/ 2) formbuilder_changes.posY = parseInt(/*top*/ ctx[1]);
    			if (dirty[0] & /*$metadata*/ 16384) formbuilder_changes.no_edit = /*$metadata*/ ctx[14].tags.includes('Default');
    			formbuilder.$set(formbuilder_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formbuilder.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formbuilder.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			destroy_component(formbuilder, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(758:12) {#if state === \\\"editForm\\\"}",
    		ctx
    	});

    	return block;
    }

    // (762:12) {#if state === "editRules"}
    function create_if_block_16(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_17, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_8(ctx, dirty) {
    		if (/*$metadata*/ ctx[14].forms && /*$metadata*/ ctx[14].forms.default && /*$metadata*/ ctx[14].forms.default.elements) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_8(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "margin-top", "10px");
    			add_location(div, file, 762, 16, 29237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_8(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(762:12) {#if state === \\\"editRules\\\"}",
    		ctx
    	});

    	return block;
    }

    // (766:16) {:else}
    function create_else_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Please define a form first");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(766:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (764:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}
    function create_if_block_17(ctx) {
    	let ruleeditor;
    	let current;

    	ruleeditor = new RuleEditor({
    			props: {
    				no_edit: /*$metadata*/ ctx[14].tags.includes('Default')
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(ruleeditor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ruleeditor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const ruleeditor_changes = {};
    			if (dirty[0] & /*$metadata*/ 16384) ruleeditor_changes.no_edit = /*$metadata*/ ctx[14].tags.includes('Default');
    			ruleeditor.$set(ruleeditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ruleeditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ruleeditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ruleeditor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(764:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}",
    		ctx
    	});

    	return block;
    }

    // (770:12) {#if state === "list"}
    function create_if_block_8(ctx) {
    	let div0;
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let div1;
    	let t3;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*tags*/ ctx[17];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let if_block = /*workflowList*/ ctx[18] && create_if_block_9(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Workflow List";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(h1, file, 771, 20, 29687);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "class", "searchQuery");
    			add_location(input, file, 771, 43, 29710);
    			attr_dev(div0, "class", "header-container");
    			add_location(div0, file, 770, 16, 29635);
    			attr_dev(div1, "class", "tags");
    			add_location(div1, file, 773, 16, 29837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, input);
    			set_input_value(input, /*searchQuery*/ ctx[12]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_3*/ ctx[63]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*searchQuery*/ 4096 && input.value !== /*searchQuery*/ ctx[12]) {
    				set_input_value(input, /*searchQuery*/ ctx[12]);
    			}

    			if (dirty[0] & /*activatedTags, tags, $workflowList*/ 139296) {
    				each_value_4 = /*tags*/ ctx[17];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (/*workflowList*/ ctx[18]) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(770:12) {#if state === \\\"list\\\"}",
    		ctx
    	});

    	return block;
    }

    // (775:20) {#each tags as tag}
    function create_each_block_4(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[96] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_15(...args) {
    		return /*click_handler_15*/ ctx[64](/*tag*/ ctx[96], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[96]]);
    			add_location(div, file, 776, 24, 30004);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_15, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*activatedTags, tags*/ 131104) {
    				toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[96]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(775:20) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (782:16) {#if workflowList}
    function create_if_block_9(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_2 = /*$workflowList*/ ctx[13];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
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
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*loadWorkflow, $workflowList, deactivatedworkflows, isVisible, searchQuery*/ 603992320 | dirty[1] & /*changeActiveDeafaultWorkflow, deleteWorkflow*/ 264) {
    				each_value_2 = /*$workflowList*/ ctx[13];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
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
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(782:16) {#if workflowList}",
    		ctx
    	});

    	return block;
    }

    // (784:24) {#if !searchQuery || workflow.name.toLowerCase().includes(searchQuery.toLowerCase())}
    function create_if_block_10(ctx) {
    	let show_if = /*isVisible*/ ctx[26](/*workflow*/ ctx[89]);
    	let if_block_anchor;
    	let current;
    	let if_block = show_if && create_if_block_11(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 8192) show_if = /*isVisible*/ ctx[26](/*workflow*/ ctx[89]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*$workflowList*/ 8192) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_11(ctx);
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
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(784:24) {#if !searchQuery || workflow.name.toLowerCase().includes(searchQuery.toLowerCase())}",
    		ctx
    	});

    	return block;
    }

    // (785:28) {#if isVisible(workflow)}
    function create_if_block_11(ctx) {
    	let div3;
    	let div0;
    	let t0_value = /*workflow*/ ctx[89].name + "";
    	let t0;
    	let div0_class_value;
    	let t1;
    	let div1;
    	let t2_value = /*workflow*/ ctx[89].lastModifiedReadable + "";
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*workflow*/ ctx[89].gyre && /*workflow*/ ctx[89].gyre.tags && create_if_block_15(ctx);
    	let if_block1 = !/*workflow*/ ctx[89].defaultworkflow && create_if_block_14(ctx);
    	let if_block2 = /*workflow*/ ctx[89].defaultworkflow && create_if_block_12(ctx);

    	function click_handler_19(...args) {
    		return /*click_handler_19*/ ctx[68](/*workflow*/ ctx[89], ...args);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			t6 = space();

    			attr_dev(div0, "class", div0_class_value = /*workflow*/ ctx[89].missingNodes || /*workflow*/ ctx[89].missingModels
    			? 'missingNodesOrModels'
    			: '');

    			add_location(div0, file, 787, 36, 30778);
    			attr_dev(div1, "class", "last_changed");
    			add_location(div1, file, 788, 36, 30931);
    			attr_dev(div2, "class", "tags");
    			add_location(div2, file, 789, 36, 31032);
    			set_style(div3, "position", "relative");
    			attr_dev(div3, "class", "workflowEntry");
    			add_location(div3, file, 786, 32, 30643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div3, t4);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t5);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t6);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div3, "click", click_handler_19, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*$workflowList*/ 8192) && t0_value !== (t0_value = /*workflow*/ ctx[89].name + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*$workflowList*/ 8192 && div0_class_value !== (div0_class_value = /*workflow*/ ctx[89].missingNodes || /*workflow*/ ctx[89].missingModels
    			? 'missingNodesOrModels'
    			: '')) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if ((!current || dirty[0] & /*$workflowList*/ 8192) && t2_value !== (t2_value = /*workflow*/ ctx[89].lastModifiedReadable + "")) set_data_dev(t2, t2_value);

    			if (/*workflow*/ ctx[89].gyre && /*workflow*/ ctx[89].gyre.tags) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_15(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*workflow*/ ctx[89].defaultworkflow) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*$workflowList*/ 8192) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_14(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, t5);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*workflow*/ ctx[89].defaultworkflow) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*$workflowList*/ 8192) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_12(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div3, t6);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(785:28) {#if isVisible(workflow)}",
    		ctx
    	});

    	return block;
    }

    // (791:40) {#if workflow.gyre && workflow.gyre.tags}
    function create_if_block_15(ctx) {
    	let each_1_anchor;
    	let each_value_3 = /*workflow*/ ctx[89].gyre.tags;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
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
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 8192) {
    				each_value_3 = /*workflow*/ ctx[89].gyre.tags;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(791:40) {#if workflow.gyre && workflow.gyre.tags}",
    		ctx
    	});

    	return block;
    }

    // (792:44) {#each workflow.gyre.tags as tag}
    function create_each_block_3(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[96] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 792, 48, 31262);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 8192 && t_value !== (t_value = /*tag*/ ctx[96] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(792:44) {#each workflow.gyre.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (797:36) {#if !workflow.defaultworkflow}
    function create_if_block_14(ctx) {
    	let div;
    	let icon;
    	let current;

    	function click_handler_16(...args) {
    		return /*click_handler_16*/ ctx[65](/*workflow*/ ctx[89], ...args);
    	}

    	icon = new Icon({
    			props: { name: "delete" },
    			$$inline: true
    		});

    	icon.$on("click", click_handler_16);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "deleteicon");
    			add_location(div, file, 797, 40, 31545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(797:36) {#if !workflow.defaultworkflow}",
    		ctx
    	});

    	return block;
    }

    // (803:36) {#if workflow.defaultworkflow}
    function create_if_block_12(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_13, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_9(ctx, dirty) {
    		if (dirty[0] & /*deactivatedworkflows, $workflowList*/ 8448) show_if = null;
    		if (show_if == null) show_if = !!/*deactivatedworkflows*/ ctx[8].includes(/*workflow*/ ctx[89].gyre.workflowid);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_9(ctx, [-1, -1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_9(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(803:36) {#if workflow.defaultworkflow}",
    		ctx
    	});

    	return block;
    }

    // (810:44) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let icon;
    	let current;

    	function click_handler_18(...args) {
    		return /*click_handler_18*/ ctx[67](/*workflow*/ ctx[89], ...args);
    	}

    	icon = new Icon({
    			props: { name: "deactivated" },
    			$$inline: true
    		});

    	icon.$on("click", click_handler_18);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "deleteicon");
    			add_location(div, file, 810, 44, 32386);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(810:44) {:else}",
    		ctx
    	});

    	return block;
    }

    // (805:40) {#if deactivatedworkflows.includes(workflow.gyre.workflowid)}
    function create_if_block_13(ctx) {
    	let div;
    	let icon;
    	let current;

    	function click_handler_17(...args) {
    		return /*click_handler_17*/ ctx[66](/*workflow*/ ctx[89], ...args);
    	}

    	icon = new Icon({
    			props: { name: "activateback" },
    			$$inline: true
    		});

    	icon.$on("click", click_handler_17);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "deleteicon");
    			add_location(div, file, 805, 44, 31998);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(805:40) {#if deactivatedworkflows.includes(workflow.gyre.workflowid)}",
    		ctx
    	});

    	return block;
    }

    // (783:20) {#each $workflowList as workflow}
    function create_each_block_2(ctx) {
    	let show_if = !/*searchQuery*/ ctx[12] || /*workflow*/ ctx[89].name.toLowerCase().includes(/*searchQuery*/ ctx[12].toLowerCase());
    	let if_block_anchor;
    	let current;
    	let if_block = show_if && create_if_block_10(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*searchQuery, $workflowList*/ 12288) show_if = !/*searchQuery*/ ctx[12] || /*workflow*/ ctx[89].name.toLowerCase().includes(/*searchQuery*/ ctx[12].toLowerCase());

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*searchQuery, $workflowList*/ 12288) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_10(ctx);
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
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(783:20) {#each $workflowList as workflow}",
    		ctx
    	});

    	return block;
    }

    // (828:12) {#if state === "errorlogs"}
    function create_if_block_1(ctx) {
    	let t0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let t5;
    	let if_block2_anchor;
    	let mounted;
    	let dispose;

    	function select_block_type_10(ctx, dirty) {
    		if (/*debugmode*/ ctx[7] == 'errormode') return create_if_block_7;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_10(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*debugmode*/ ctx[7] == 'errormode' && create_if_block_4(ctx);
    	let if_block2 = /*debugmode*/ ctx[7] == 'debugmode' && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "Error Log";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Debug Log";
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			toggle_class(button0, "inactive", /*debugmode*/ ctx[7] != 'errormode');
    			add_location(button0, file, 833, 16, 33145);
    			toggle_class(button1, "inactive", /*debugmode*/ ctx[7] != 'debugmode');
    			add_location(button1, file, 834, 16, 33300);
    		},
    		m: function mount(target, anchor) {
    			if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_20*/ ctx[69], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_21*/ ctx[70], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_10(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			}

    			if (dirty[0] & /*debugmode*/ 128) {
    				toggle_class(button0, "inactive", /*debugmode*/ ctx[7] != 'errormode');
    			}

    			if (dirty[0] & /*debugmode*/ 128) {
    				toggle_class(button1, "inactive", /*debugmode*/ ctx[7] != 'debugmode');
    			}

    			if (/*debugmode*/ ctx[7] == 'errormode') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(t5.parentNode, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*debugmode*/ ctx[7] == 'debugmode') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t4);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(828:12) {#if state === \\\"errorlogs\\\"}",
    		ctx
    	});

    	return block;
    }

    // (831:16) {:else}
    function create_else_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Debug logs";
    			add_location(h1, file, 831, 20, 33085);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(831:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (829:16) {#if debugmode=='errormode'}
    function create_if_block_7(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Error logs";
    			add_location(h1, file, 829, 20, 33019);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(829:16) {#if debugmode=='errormode'}",
    		ctx
    	});

    	return block;
    }

    // (837:16) {#if debugmode=='errormode'}
    function create_if_block_4(ctx) {
    	let if_block_anchor;
    	let if_block = /*workflowList*/ ctx[18] && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*workflowList*/ ctx[18]) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(837:16) {#if debugmode=='errormode'}",
    		ctx
    	});

    	return block;
    }

    // (838:20) {#if workflowList}
    function create_if_block_5(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*$workflowapiList*/ ctx[16];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
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
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*loadWorkflow, $workflowapiList, isVisible*/ 604045312) {
    				each_value_1 = /*$workflowapiList*/ ctx[16];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(838:20) {#if workflowList}",
    		ctx
    	});

    	return block;
    }

    // (840:28) {#if isVisible(workflow)}
    function create_if_block_6(ctx) {
    	let div;
    	let t0_value = /*workflow*/ ctx[89].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			set_style(div, "position", "relative");
    			attr_dev(div, "class", "workflowEntry");
    			add_location(div, file, 841, 32, 33765);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*loadWorkflow*/ ctx[29](/*workflow*/ ctx[89]))) /*loadWorkflow*/ ctx[29](/*workflow*/ ctx[89]).apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$workflowapiList*/ 65536 && t0_value !== (t0_value = /*workflow*/ ctx[89].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(840:28) {#if isVisible(workflow)}",
    		ctx
    	});

    	return block;
    }

    // (839:24) {#each $workflowapiList as workflow}
    function create_each_block_1(ctx) {
    	let show_if = /*isVisible*/ ctx[26](/*workflow*/ ctx[89]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowapiList*/ 65536) show_if = /*isVisible*/ ctx[26](/*workflow*/ ctx[89]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(839:24) {#each $workflowapiList as workflow}",
    		ctx
    	});

    	return block;
    }

    // (850:16) {#if debugmode=='debugmode'}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value = /*$workflowdebugList*/ ctx[15];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowdebugList, loadWorkflow, isVisible*/ 604012544 | dirty[1] & /*loadWorkflowForm*/ 128) {
    				each_value = /*$workflowdebugList*/ ctx[15];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(850:16) {#if debugmode=='debugmode'}",
    		ctx
    	});

    	return block;
    }

    // (852:28) {#if isVisible(workflow)}
    function create_if_block_3(ctx) {
    	let div0;
    	let t0_value = /*workflow*/ ctx[89].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3_value = /*workflow*/ ctx[89].name + "";
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Form data ");
    			t3 = text(t3_value);
    			t4 = space();
    			set_style(div0, "position", "relative");
    			attr_dev(div0, "class", "workflowEntry");
    			add_location(div0, file, 853, 32, 34355);
    			set_style(div1, "position", "relative");
    			attr_dev(div1, "class", "workflowEntry");
    			add_location(div1, file, 857, 32, 34660);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div0,
    						"click",
    						function () {
    							if (is_function(/*loadWorkflow*/ ctx[29](/*workflow*/ ctx[89]))) /*loadWorkflow*/ ctx[29](/*workflow*/ ctx[89]).apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"click",
    						function () {
    							if (is_function(/*loadWorkflowForm*/ ctx[38](/*workflow*/ ctx[89]))) /*loadWorkflowForm*/ ctx[38](/*workflow*/ ctx[89]).apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$workflowdebugList*/ 32768 && t0_value !== (t0_value = /*workflow*/ ctx[89].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*$workflowdebugList*/ 32768 && t3_value !== (t3_value = /*workflow*/ ctx[89].name + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(852:28) {#if isVisible(workflow)}",
    		ctx
    	});

    	return block;
    }

    // (851:24) {#each $workflowdebugList as workflow}
    function create_each_block(ctx) {
    	let show_if = /*isVisible*/ ctx[26](/*workflow*/ ctx[89]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowdebugList*/ 32768) show_if = /*isVisible*/ ctx[26](/*workflow*/ ctx[89]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(851:24) {#each $workflowdebugList as workflow}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let icon;
    	let t0;
    	let div1;
    	let current_block_type_index;
    	let if_block0;
    	let t1;
    	let t2;
    	let t3;
    	let mappings;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { name: "move" }, $$inline: true });
    	icon.$on("mousedown", /*onMouseDown*/ ctx[23]);
    	const if_block_creators = [create_if_block_38, create_else_block_7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*name*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = !/*foldOut*/ ctx[2] && create_if_block_37(ctx);
    	let if_block2 = /*foldOut*/ ctx[2] && create_if_block(ctx);
    	mappings = new Mappings({ $$inline: true });
    	mappings.$on("updateForm", /*updateForm_handler*/ ctx[71]);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			create_component(mappings.$$.fragment);
    			attr_dev(div0, "class", "moveIcon");
    			add_location(div0, file, 618, 12, 21465);
    			attr_dev(div1, "class", "title");
    			add_location(div1, file, 621, 12, 21591);
    			attr_dev(div2, "class", "miniMenu");
    			add_location(div2, file, 617, 2, 21429);
    			attr_dev(div3, "id", "workflowManager");
    			attr_dev(div3, "class", "workflowManager");
    			set_style(div3, "left", /*left*/ ctx[0] + "px");
    			set_style(div3, "top", /*top*/ ctx[1] + "px");
    			add_location(div3, file, 616, 0, 21337);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(icon, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div3, t1);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t2);
    			if (if_block2) if_block2.m(div3, null);
    			insert_dev(target, t3, anchor);
    			mount_component(mappings, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "mouseup", /*onMouseUp*/ ctx[25], false, false, false, false),
    					listen_dev(window_1, "mousemove", /*onMouseMove*/ ctx[24], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div1, null);
    			}

    			if (!/*foldOut*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*foldOut*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_37(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*foldOut*/ ctx[2]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*foldOut*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*left*/ 1) {
    				set_style(div3, "left", /*left*/ ctx[0] + "px");
    			}

    			if (!current || dirty[0] & /*top*/ 2) {
    				set_style(div3, "top", /*top*/ ctx[1] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(mappings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(mappings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(icon);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t3);
    			destroy_component(mappings, detaching);
    			mounted = false;
    			run_all(dispose);
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

    function getAvalableFileName(name) {
    	if (!name) return 'new';
    	return name;
    }

    async function getListFromServer(endpoint = "/gyre/collect_gyre_components") {
    	try {
    		const response = await fetch(endpoint, {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify({ path: "" })
    		});

    		let result = await response.json();
    		return result;
    	} catch(error) {
    		console.error("Error getListFromServer:", endpoint, error);
    	}
    }

    function fixDatesFromServer(result) {
    	let newel = result.map(el => {
    		let objjs = JSON.parse(el.json);
    		objjs.extra.gyre.lastModified = new Date(el.lastmodified * 1000).getTime();
    		let datestr = new Date(el.lastmodified * 1000).toISOString();
    		objjs.extra.gyre.lastModifiedReadable = datestr.split('T')[0] + " " + datestr.split('T')[1].replace(/\.[^/.]+$/, "");
    		let json = JSON.stringify(objjs);
    		return { ...el, json };
    	});

    	return newel;
    }

    function showStructure() {
    	let workflow = window.app.graph.serialize();
    	console.log(workflow);
    }

    async function renameFile(file_path, new_file_path) {
    	try {
    		const response = await fetch("/gyre/rename_workflowfile", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify({ file_path, new_file_path })
    		});

    		const result = await response.text();
    		return result;
    	} catch(error) {
    		alert("Error rename .json file: " + error);
    		console.error("Error rename workspace:", error);
    	}
    }

    async function updateFile(file_path, jsonData) {
    	try {
    		const response = await fetch("/gyre/update_json_file", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify({ file_path, json_str: jsonData })
    		});

    		const result = await response.text();
    		return result;
    	} catch(error) {
    		alert("Error saving workflow .json file: " + error);
    		console.error("Error saving workspace:", error);
    	}
    }

    async function deleteFile(file_path) {
    	try {
    		const response = await fetch("/gyre/delete_workflow_file", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify({ file_path })
    		});

    		const result = await response.text();
    		return result;
    	} catch(error) {
    		alert("Error delete workflow .json file: " + error);
    		console.error("Error saving workspace:", error);
    	}
    }

    function download(text) {
    	var element = document.createElement('a');
    	element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(text));
    	element.setAttribute('download', 'formdata.json');
    	document.body.appendChild(element);
    	element.click();
    	document.body.removeChild(element);
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $workflowList;
    	let $workflowformList;
    	let $metadata;
    	let $workflowdebugList;
    	let $workflowapiList;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(14, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WorkflowManager', slots, []);
    	let allworkflows;
    	let moving = false;
    	let left = 10;
    	let top = 10;
    	let styleel;
    	let loadedworkflow;
    	let foldOut = false;
    	let name = ""; // current loaded workflow name
    	let state = "list";

    	let tags = [
    		"Txt2Image",
    		"Inpainting",
    		"ControlNet",
    		"LayerMenu",
    		"Deactivated",
    		"Img2Img",
    		"Default"
    	];

    	let workflowList = writable([]); // todo:load all workflow basic data (name, last changed and gyre object) from server via server request
    	validate_store(workflowList, 'workflowList');
    	component_subscribe($$self, workflowList, value => $$invalidate(13, $workflowList = value));
    	let workflowapiList = writable([]);
    	validate_store(workflowapiList, 'workflowapiList');
    	component_subscribe($$self, workflowapiList, value => $$invalidate(16, $workflowapiList = value));
    	let workflowdebugList = writable([]);
    	validate_store(workflowdebugList, 'workflowdebugList');
    	component_subscribe($$self, workflowdebugList, value => $$invalidate(15, $workflowdebugList = value));
    	let workflowformList = writable([]);
    	validate_store(workflowformList, 'workflowformList');
    	component_subscribe($$self, workflowformList, value => $$invalidate(80, $workflowformList = value));
    	let activatedTags = {};
    	let selectedTag = "";
    	let orginalname;
    	let duplicate = false;
    	let debug = false;
    	let debugmode = 'errormode';
    	let actioniconclicked;
    	let virtualNodes = [];
    	let deactivatedworkflows = [];
    	let allworkflowswithdefaults;
    	let allModels = [];

    	function onMouseDown() {
    		moving = true;
    	}

    	function onMouseMove(e) {
    		if (moving) {
    			$$invalidate(0, left += e.movementX);
    			$$invalidate(1, top += e.movementY);
    		}
    	}

    	onMount(async () => {
    		await getAllModels();
    		await loadList();
    		await loadLogList();
    		addExternalLoadListener();
    		let lastloadedworkflowname = localStorage.getItem("lastgyreworkflowloaded");

    		if (lastloadedworkflowname) {
    			let current = $workflowList.find(el => {
    				return el.name == lastloadedworkflowname;
    			});

    			loadWorkflow(current);
    			loadUIComponents();
    		}
    	});

    	function addExternalLoadListener() {
    		const fileInput = document.getElementById("comfy-file-input");

    		const fileInputListener = async () => {
    			if (fileInput && fileInput.files && fileInput.files.length > 0) {
    				new Date(fileInput.files[0].lastModified).toDateString();
    				let fixedfilename = getAvalableFileName(fileInput.files[0].name);
    				let graph = window.app.graph.serialize();
    				graph.name = fixedfilename;
    				graph.lastModified = fileInput.files[0].lastModified;
    				if (!graph.extra?.workspace_info) graph.extra.workspace_info = [];
    				graph.extra.workspace_info.name = fixedfilename;
    				graph.extra.workspace_info.lastModified = fileInput.files[0].lastModified;
    				graph.extra.workspace_info.lastModifiedReadable = new Date(fileInput.files[0].lastModified).toISOString().split('T')[0];

    				if (!graph.extra.gyre) {
    					graph.extra.gyre = {};
    				}

    				graph.extra.gyre.lastModified = fileInput.files[0].lastModified;
    				graph.extra.gyre.lastModifiedReadable = new Date(fileInput.files[0].lastModified).toISOString().split('T')[0];
    				loadedworkflow = graph;
    				loadWorkflow(graph);
    			}
    		};

    		fileInput?.addEventListener("change", fileInputListener);
    	}

    	function onMouseUp() {
    		moving = false;
    	}

    	function isVisible(workflow) {
    		let mytags = workflow?.gyre?.tags || [];

    		for (let activeTag in activatedTags) {
    			if (activatedTags[activeTag] && !mytags.includes(activeTag)) return false;
    		}

    		return true;
    	}

    	/**
     * read all logs
     */
    	async function loadLogList() {
    		// todo: make server request and read $metadata of all existing workflows on filesystem
    		let result = await scanLocalNewFiles('logs');

    		result = result.sort((a, b) => b.name.replace(/[^0-9]/g, "") - a.name.replace(/[^0-9]/g, ""));
    		workflowapiList.set(result);
    		result = await scanLocalNewFiles('debugs');
    		result = result.sort((a, b) => b.name.replace(/[^0-9]/g, "") - a.name.replace(/[^0-9]/g, ""));
    		workflowdebugList.set(result);
    		result = await scanLocalNewFiles('formdata');
    		result = result.sort((a, b) => b.name.replace(/[^0-9]/g, "") - a.name.replace(/[^0-9]/g, ""));
    		workflowformList.set(result);
    		result = await scanLocalNewFiles('deactivatedworkflows');
    		console.log("result", result);

    		if (result.length) {
    			$$invalidate(8, deactivatedworkflows = JSON.parse(result[0].json));
    		}
    	}

    	/**
     * read all workflows
     */
    	async function loadList() {
    		// todo: make server request and read $metadata of all existing workflows on filesystem
    		let result = await scanLocalNewFiles();

    		let resultdefaults = await scanLocalNewFiles('defaults');

    		resultdefaults = resultdefaults.map(el => {
    			let jsn = JSON.parse(el.json);
    			jsn.extra.gyre.tags.push("Default");
    			el.json = JSON.stringify(jsn);
    			let res = { defaultworkflow: true, ...el };
    			return res;
    		});

    		result = [...resultdefaults, ...result];

    		let data_workflow_list = result.map(el => {
    			let res = { name: el.name };
    			if (el.defaultworkflow) res.defaultworkflow = true;
    			let gyre = null;
    			if (el.json) gyre = JSON.parse(el.json).extra.gyre;
    			res.lastModifiedReadable = JSON.parse(el.json).extra.gyre?.lastModifiedReadable || "";
    			res.json = el.json;
    			res.missingNodes = el.missingNodes;
    			res.missingModels = el.missingModels;

    			if (gyre) {
    				res.gyre = gyre;
    				res.gyre.lastModifiedReadable = JSON.parse(el.json).extra.gyre?.lastModifiedReadable || "";
    				res.gyre.lastModified = JSON.parse(el.json).extra.gyre?.lastModified || "";
    				if (!res.gyre.workflowid) res.gyre.workflowid = (Math.random() + 1).toString(36).substring(2);
    			}

    			return res;
    		});

    		workflowList.set(data_workflow_list);
    	}

    	let custom_ui_components;

    	/**
     * get list with all UI components
     */
    	async function loadUIComponents() {
    		$$invalidate(10, custom_ui_components = await getListFromServer());
    	} // console.log("COMPONENTS",custom_ui_components)

    	/**
     * get list of all installed models
     */
    	async function getAllModels() {
    		let res = await getListFromServer("/gyre/get_all_models");
    		if (res) $$invalidate(9, allModels = res.models);
    	} //       console.log("All models",allModels)

    	async function updateDeactivatedDefaultWorkflows() {
    		try {
    			const response = await fetch(`/gyre/upload_log_json_file`, {
    				method: "POST",
    				headers: { "Content-Type": "application/json" },
    				body: JSON.stringify({
    					file_path: 'deactivatedworkflows.json',
    					json_str: JSON.stringify(deactivatedworkflows),
    					debugdir: 'deactivatedworkflows'
    				})
    			});
    		} catch(error) {
    			alert("Error saving workflow .json file: " + error);
    			console.error("Error saving workspace:", error);
    		}
    	}

    	async function scanLocalNewFiles(type) {
    		let existFlowIds = [];

    		try {
    			const response = await fetch("/gyre/readworkflowdir", {
    				method: "POST",
    				headers: { "Content-Type": "application/json" },
    				body: JSON.stringify({ path: "", existFlowIds, type })
    			});

    			let result = await response.json();

    			if (type != 'logs' && type != 'debugs' && type != 'formdata' && type != 'deactivatedworkflows') {
    				result = fixDatesFromServer(result);

    				if (type != 'defaults') {
    					allworkflows = result;
    				}

    				markWorkflowsWithMissingNodesAndModels(result);
    				allworkflowswithdefaults = result;
    			}

    			return result;
    		} catch(error) {
    			console.error("Error scan local new files:", error);
    		}
    	}

    	function markWorkflowsWithMissingNodesAndModels(list) {
    		let nm = new nodesManager();
    		let mm = new modelsManager(allModels);

    		for (let i = 0; i < list.length; i++) {
    			let entry = list[i];

    			if (entry.json) {
    				let workflow = JSON.parse(entry.json);
    				let res = nm.checkMissingNodes(workflow);
    				if (!res) entry.missingNodes = true;
    				res = mm.checkMissingModels(workflow);
    				if (!res) entry.missingModels = true;
    			}
    		}
    	}

    	async function loadWorkflow(workflow, e) {
    		if (actioniconclicked) {
    			actioniconclicked = false;
    			return;
    		}

    		await loadList();
    		if (!workflow) return;

    		if (!workflow.gyre) {
    			workflow.gyre = {};
    			workflow.gyre.tags = [];
    		}

    		orginalname = workflow.name;

    		//  console.log("load workflow!!",orginalname,workflow.name);
    		$$invalidate(3, name = workflow.name);

    		set_store_value(metadata, $metadata = workflow.gyre, $metadata);
    		if (!$metadata.tags) set_store_value(metadata, $metadata.tags = [], $metadata);

    		if (window.app.graph == null) {
    			console.error("app.graph is null cannot load workflow");
    			return;
    		}

    		if (window.gyreClearAllComboValues) window.gyreClearAllComboValues();

    		let current = allworkflowswithdefaults.find(el => {
    			return el.name == workflow.name;
    		});

    		if (state == "errorlogs") {
    			if (debugmode == 'errormode') {
    				current = $workflowapiList.find(el => {
    					return el.name == workflow.name;
    				});

    				window.app.loadApiJson(JSON.parse(current.json));
    				$$invalidate(4, state = "errorlogs");
    				return;
    			}

    			if (debugmode == 'debugmode') {
    				current = $workflowdebugList.find(el => {
    					return el.name == workflow.name;
    				});

    				let wf = JSON.parse(current.json);
    				window.app.loadGraphData(wf);
    				$$invalidate(4, state = "errorlogs");
    				return;
    			}
    		}

    		localStorage.setItem('lastgyreworkflowloaded', workflow.name);

    		if (!loadedworkflow) {
    			if (!current) {
    				let wf = JSON.parse(workflow.json);
    				if (!wf.name && name) wf.name = name;
    				window.app.loadGraphData(wf);
    			} else {
    				let wf = JSON.parse(current.json); //window.app.loadGraphData(workflow);
    				if (!wf.name && name) wf.name = name;
    				window.app.loadGraphData(wf);
    			}

    			$$invalidate(4, state = "properties");
    		}
    	}

    	async function testFirstPass() {
    		let workflow = window.app.graph.serialize();
    		workflow = JSON.parse(JSON.stringify(workflow));
    		console.log(workflow);

    		//        let loop=new loopPreparser(workflow)
    		//        loop.generateLoop("controlnet",3)
    		//        console.log(workflow)
    		let parser = new ComfyUIPreparser(workflow);

    		await parser.execute(parser.getTestData());
    		window.app.loadGraphData(workflow);
    		set_store_value(metadata, $metadata = workflow.extra.gyre, $metadata);
    	}

    	async function getVirtualNodes() {
    		for (const outerNode of window.app.graph.computeExecutionOrder(false)) {
    			const innerNodes = outerNode.getInnerNodes
    			? outerNode.getInnerNodes()
    			: [outerNode];

    			for (const node of innerNodes) {
    				if (node.isVirtualNode) {
    					virtualNodes.push(node.type);
    				}
    			}
    		}
    	}

    	async function saveWorkflow() {
    		//    console.log("saveWorkflow");
    		let helper = new mappingsHelper();

    		helper.cleanUpMappings($metadata);
    		getVirtualNodes();
    		window.app.graph.serialize_widgets = true;
    		let graph = window.app.graph.serialize();

    		//if (!$metadata.virtualNodes || ($metadata.virtualNodes && !$metadata.virtualNodes.length)){
    		virtualNodes = [...new Set(virtualNodes)];

    		set_store_value(metadata, $metadata.virtualNodes = virtualNodes, $metadata);

    		//}
    		for (let i = 0; i < graph.nodes.length; i++) {
    			let node = graph.nodes[i];
    			let _node = window.app.graph._nodes[i];
    			if (!$metadata.nodeWidgets) set_store_value(metadata, $metadata.nodeWidgets = {}, $metadata);

    			// remove image list from values
    			if (_node && _node.widgets != void 0) {
    				let newwidgets = JSON.parse(JSON.stringify(_node.widgets));

    				newwidgets.forEach(el => {
    					if (el.name == 'image') {
    						el.options.values = [];
    					}
    				});

    				set_store_value(metadata, $metadata.nodeWidgets[node.id] = newwidgets, $metadata);
    			}
    		} //   node.widgets=_node.widgets

    		// this is scenario just after loading workflow and not save it
    		if (loadedworkflow && loadedworkflow.extra.workspace_info) {
    			graph.extra = loadedworkflow.extra;
    			set_store_value(metadata, $metadata = loadedworkflow.extra.gyre, $metadata);
    		}

    		loadedworkflow = null;
    		let file_path = graph.extra?.workspace_info?.name || "new.json";

    		if (name) {
    			file_path = name;
    		}

    		// console.log("save file: ",file_path,"name: ",name,"gyrename: ",graph.extra?.workspace_info?.name);
    		if (!file_path.endsWith('.json')) {
    			// Add .json extension if it doesn't exist
    			file_path += '.json';
    		}

    		if ($metadata && graph.extra) graph.extra.gyre = $metadata;
    		const graphJson = JSON.stringify(graph);

    		if (orginalname != name && !duplicate) {
    			let new_file_path;

    			if (orginalname) {
    				new_file_path = orginalname;
    			}

    			if (!new_file_path.endsWith('.json')) {
    				new_file_path += '.json';
    			}

    			await updateFile(new_file_path, graphJson);
    			await renameFile(new_file_path, file_path);
    			duplicate = false;
    			orginalname = name;
    		} else {
    			await updateFile(file_path, graphJson);

    			if (duplicate) {
    				orginalname = name;
    				duplicate = false;
    			}
    		}

    		await loadList();
    	}

    	function addTag() {
    		if (!selectedTag) return;
    		if (!$metadata.tags) set_store_value(metadata, $metadata.tags = [], $metadata);

    		if (selectedTag === "LayerMenu") {
    			removeTag("ControlNet");
    			removeTag("Txt2Image");
    			removeTag("Inpainting");
    		}

    		if (selectedTag === "Txt2Image" || selectedTag === "Inpainting" || selectedTag === "ControlNet") {
    			removeTag("LayerMenu");
    		}

    		$metadata.tags.push(selectedTag);
    		metadata.set($metadata);
    	}

    	function removeTag(tag) {
    		const index = $metadata.tags.indexOf(tag);
    		if (index < 0) return;
    		$metadata.tags.splice(index, 1);
    		metadata.set($metadata);
    	}

    	function deleteWorkflow(workflow) {
    		if (confirm("Delete Workflow?") == true) {
    			let name = workflow.name;

    			if (!name.endsWith('.json')) {
    				name += '.json';
    			}

    			deleteFile(name);
    			workflowList.set($workflowList);
    		}
    	}

    	function duplicateWorkflow() {
    		$$invalidate(3, name = 'Copy of ' + name);
    		set_store_value(metadata, $metadata.workflowid = (Math.random() + 1).toString(36).substring(2), $metadata);
    		set_store_value(metadata, $metadata.tags = $metadata.tags.filter(el => el != 'Default'), $metadata);
    		removeTag('Default');
    		duplicate = true;
    		saveWorkflow();
    		localStorage.setItem('lastgyreworkflowloaded', name);
    	}

    	let refresh = 0;

    	function updateForm() {
    		if (state !== "editForm") return;
    		$$invalidate(11, refresh++, refresh);
    	}

    	function refreshTags(e) {
    		set_store_value(metadata, $metadata.tags = e.detail, $metadata);
    	}

    	function loadWorkflowForm(element) {
    		let elem = $workflowformList.find(el => {
    			return el.name == 'formdata_' + element.name;
    		});

    		download(elem.json);
    	}

    	async function changeActiveDeafaultWorkflow(element, type) {
    		console.log("element", element);
    		actioniconclicked = true;

    		if (type == 'deactivate') {
    			deactivatedworkflows.push(element.gyre.workflowid);
    		} else {
    			$$invalidate(8, deactivatedworkflows = deactivatedworkflows.filter(el => el != element.gyre.workflowid));
    		}

    		await updateDeactivatedDefaultWorkflows();
    		workflowList.set($workflowList);
    	}

    	let searchQuery = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<WorkflowManager> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		$$invalidate(2, foldOut = true);
    	};

    	const click_handler_1 = e => {
    		$$invalidate(2, foldOut = true);
    	};

    	const click_handler_2 = e => {
    		saveWorkflow();
    	};

    	const click_handler_3 = e => {
    		$$invalidate(2, foldOut = true);
    	};

    	const click_handler_4 = e => {
    		testFirstPass();
    	};

    	const click_handler_5 = e => {
    		showStructure();
    	};

    	const click_handler_6 = e => {
    		$$invalidate(2, foldOut = false);
    	};

    	const click_handler_7 = e => {
    		$$invalidate(4, state = "list");
    	};

    	const click_handler_8 = async e => {
    		$$invalidate(4, state = "properties");
    	};

    	const click_handler_9 = async e => {
    		$$invalidate(4, state = "editForm");
    	};

    	const click_handler_10 = async e => {
    		$$invalidate(4, state = "editRules");
    	};

    	const click_handler_11 = async e => {
    		await loadLogList();
    		$$invalidate(4, state = "errorlogs");
    	};

    	const click_handler_12 = async e => {
    		await loadLogList();
    		$$invalidate(4, state = "errorlogs");
    	};

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(3, name);
    	}

    	const click_handler_13 = e => {
    		duplicateWorkflow();
    	};

    	const click_handler_14 = (tag, e) => {
    		removeTag(tag);
    	};

    	function select_change_handler() {
    		selectedTag = select_value(this);
    		$$invalidate(6, selectedTag);
    		$$invalidate(17, tags);
    	}

    	const change_handler = e => {
    		addTag();
    	};

    	function select_change_handler_1() {
    		$metadata.license = select_value(this);
    		metadata.set($metadata);
    	}

    	function textarea_input_handler() {
    		$metadata.description = this.value;
    		metadata.set($metadata);
    	}

    	function input_input_handler_1() {
    		$metadata.youtube = this.value;
    		metadata.set($metadata);
    	}

    	function input_input_handler_2() {
    		$metadata.category = this.value;
    		metadata.set($metadata);
    	}

    	const refreshTags_handler = e => {
    		refreshTags(e);
    	};

    	function input_input_handler_3() {
    		searchQuery = this.value;
    		$$invalidate(12, searchQuery);
    	}

    	const click_handler_15 = (tag, e) => {
    		$$invalidate(5, activatedTags[tag] = !activatedTags[tag], activatedTags);
    		workflowList.set($workflowList);
    	};

    	const click_handler_16 = (workflow, e) => {
    		deleteWorkflow(workflow);
    	};

    	const click_handler_17 = async (workflow, e) => {
    		await changeActiveDeafaultWorkflow(workflow, "activate");
    	};

    	const click_handler_18 = async (workflow, e) => {
    		await changeActiveDeafaultWorkflow(workflow, "deactivate");
    	};

    	const click_handler_19 = (workflow, e) => {
    		loadWorkflow(workflow);
    	};

    	const click_handler_20 = async e => {
    		await loadLogList();
    		$$invalidate(7, debugmode = 'errormode');
    	};

    	const click_handler_21 = async e => {
    		await loadLogList();
    		$$invalidate(7, debugmode = 'debugmode');
    	};

    	const updateForm_handler = e => {
    		updateForm();
    	};

    	$$self.$capture_state = () => ({
    		FormBuilder,
    		EditModels,
    		RuleEditor,
    		Mappings,
    		writable,
    		onMount,
    		metadata,
    		Icon,
    		ComfyUIPreparser,
    		mappingsHelper,
    		nodesManager,
    		modelsManager,
    		allworkflows,
    		moving,
    		left,
    		top,
    		styleel,
    		loadedworkflow,
    		foldOut,
    		name,
    		state,
    		tags,
    		workflowList,
    		workflowapiList,
    		workflowdebugList,
    		workflowformList,
    		activatedTags,
    		selectedTag,
    		orginalname,
    		duplicate,
    		debug,
    		debugmode,
    		actioniconclicked,
    		virtualNodes,
    		deactivatedworkflows,
    		allworkflowswithdefaults,
    		allModels,
    		onMouseDown,
    		onMouseMove,
    		addExternalLoadListener,
    		getAvalableFileName,
    		onMouseUp,
    		isVisible,
    		loadLogList,
    		loadList,
    		custom_ui_components,
    		loadUIComponents,
    		getAllModels,
    		updateDeactivatedDefaultWorkflows,
    		scanLocalNewFiles,
    		markWorkflowsWithMissingNodesAndModels,
    		getListFromServer,
    		fixDatesFromServer,
    		loadWorkflow,
    		testFirstPass,
    		showStructure,
    		getVirtualNodes,
    		saveWorkflow,
    		renameFile,
    		updateFile,
    		deleteFile,
    		addTag,
    		removeTag,
    		deleteWorkflow,
    		duplicateWorkflow,
    		refresh,
    		updateForm,
    		refreshTags,
    		download,
    		loadWorkflowForm,
    		changeActiveDeafaultWorkflow,
    		searchQuery,
    		$workflowList,
    		$workflowformList,
    		$metadata,
    		$workflowdebugList,
    		$workflowapiList
    	});

    	$$self.$inject_state = $$props => {
    		if ('allworkflows' in $$props) allworkflows = $$props.allworkflows;
    		if ('moving' in $$props) moving = $$props.moving;
    		if ('left' in $$props) $$invalidate(0, left = $$props.left);
    		if ('top' in $$props) $$invalidate(1, top = $$props.top);
    		if ('styleel' in $$props) styleel = $$props.styleel;
    		if ('loadedworkflow' in $$props) loadedworkflow = $$props.loadedworkflow;
    		if ('foldOut' in $$props) $$invalidate(2, foldOut = $$props.foldOut);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('state' in $$props) $$invalidate(4, state = $$props.state);
    		if ('tags' in $$props) $$invalidate(17, tags = $$props.tags);
    		if ('workflowList' in $$props) $$invalidate(18, workflowList = $$props.workflowList);
    		if ('workflowapiList' in $$props) $$invalidate(19, workflowapiList = $$props.workflowapiList);
    		if ('workflowdebugList' in $$props) $$invalidate(20, workflowdebugList = $$props.workflowdebugList);
    		if ('workflowformList' in $$props) $$invalidate(21, workflowformList = $$props.workflowformList);
    		if ('activatedTags' in $$props) $$invalidate(5, activatedTags = $$props.activatedTags);
    		if ('selectedTag' in $$props) $$invalidate(6, selectedTag = $$props.selectedTag);
    		if ('orginalname' in $$props) orginalname = $$props.orginalname;
    		if ('duplicate' in $$props) duplicate = $$props.duplicate;
    		if ('debug' in $$props) $$invalidate(22, debug = $$props.debug);
    		if ('debugmode' in $$props) $$invalidate(7, debugmode = $$props.debugmode);
    		if ('actioniconclicked' in $$props) actioniconclicked = $$props.actioniconclicked;
    		if ('virtualNodes' in $$props) virtualNodes = $$props.virtualNodes;
    		if ('deactivatedworkflows' in $$props) $$invalidate(8, deactivatedworkflows = $$props.deactivatedworkflows);
    		if ('allworkflowswithdefaults' in $$props) allworkflowswithdefaults = $$props.allworkflowswithdefaults;
    		if ('allModels' in $$props) $$invalidate(9, allModels = $$props.allModels);
    		if ('custom_ui_components' in $$props) $$invalidate(10, custom_ui_components = $$props.custom_ui_components);
    		if ('refresh' in $$props) $$invalidate(11, refresh = $$props.refresh);
    		if ('searchQuery' in $$props) $$invalidate(12, searchQuery = $$props.searchQuery);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		left,
    		top,
    		foldOut,
    		name,
    		state,
    		activatedTags,
    		selectedTag,
    		debugmode,
    		deactivatedworkflows,
    		allModels,
    		custom_ui_components,
    		refresh,
    		searchQuery,
    		$workflowList,
    		$metadata,
    		$workflowdebugList,
    		$workflowapiList,
    		tags,
    		workflowList,
    		workflowapiList,
    		workflowdebugList,
    		workflowformList,
    		debug,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		isVisible,
    		loadLogList,
    		getAllModels,
    		loadWorkflow,
    		testFirstPass,
    		saveWorkflow,
    		addTag,
    		removeTag,
    		deleteWorkflow,
    		duplicateWorkflow,
    		updateForm,
    		refreshTags,
    		loadWorkflowForm,
    		changeActiveDeafaultWorkflow,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		input_input_handler,
    		click_handler_13,
    		click_handler_14,
    		select_change_handler,
    		change_handler,
    		select_change_handler_1,
    		textarea_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		refreshTags_handler,
    		input_input_handler_3,
    		click_handler_15,
    		click_handler_16,
    		click_handler_17,
    		click_handler_18,
    		click_handler_19,
    		click_handler_20,
    		click_handler_21,
    		updateForm_handler
    	];
    }

    class WorkflowManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css$1, [-1, -1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WorkflowManager",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    function add_css(target) {
    	append_styles(target, "svelte-1tky8bj", "@media(min-width: 640px){}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLnN2ZWx0ZSIsInNvdXJjZXMiOlsiQXBwLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gIGltcG9ydCBXb3JrZmxvd01hbmFnZXIgZnJvbSBcIi4vV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZVwiO1xyXG4gIFxyXG48L3NjcmlwdD5cclxuXHJcbjxXb3JrZmxvd01hbmFnZXI+PC9Xb3JrZmxvd01hbmFnZXI+XHJcblxyXG48c3R5bGU+XHJcblx0bWFpbiB7XHJcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XHJcblx0XHRwYWRkaW5nOiAxZW07XHJcblx0XHRtYXgtd2lkdGg6IDI0MHB4O1xyXG5cdFx0bWFyZ2luOiAwIGF1dG87XHJcblx0fVxyXG5cclxuXHRoMSB7XHJcblx0XHRjb2xvcjogI2ZmM2UwMDtcclxuXHRcdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcblx0XHRmb250LXNpemU6IDRlbTtcclxuXHRcdGZvbnQtd2VpZ2h0OiAxMDA7XHJcblx0fVxyXG5cclxuXHRAbWVkaWEgKG1pbi13aWR0aDogNjQwcHgpIHtcclxuXHRcdG1haW4ge1xyXG5cdFx0XHRtYXgtd2lkdGg6IG5vbmU7XHJcblx0XHR9XHJcblx0fVxyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFzQkMsTUFBTyxZQUFZLEtBQUssQ0FBRSxDQUkxQiJ9 */");
    }

    function create_fragment(ctx) {
    	let workflowmanager;
    	let current;
    	workflowmanager = new WorkflowManager({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(workflowmanager.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(workflowmanager, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(workflowmanager.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(workflowmanager.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(workflowmanager, detaching);
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
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WorkflowManager });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css);

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

})();
//# sourceMappingURL=bundle.js.map
