/**
 * Тосты (snackbar) и лёгкие диалоги в стиле приложения.
 */
(function (global) {
    const STACK_ID = 'toast-stack';

    function getStack() {
        let el = document.getElementById(STACK_ID);
        if (!el) {
            el = document.createElement('div');
            el.id = STACK_ID;
            el.className = 'toast-stack';
            el.setAttribute('aria-live', 'polite');
            document.body.appendChild(el);
        }
        return el;
    }

    function removeToast(node) {
        node.classList.add('toast--out');
        setTimeout(() => node.remove(), 280);
    }

    function show(message, options = {}) {
        const type = options.type || 'info';
        const duration = options.duration != null ? options.duration : (type === 'error' ? 6500 : 4200);

        const stack = getStack();
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.setAttribute('role', 'status');

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'toast__close';
        closeBtn.setAttribute('aria-label', 'Закрыть');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => removeToast(toast));

        const text = document.createElement('div');
        text.className = 'toast__text';
        text.textContent = message;

        toast.appendChild(text);
        toast.appendChild(closeBtn);
        stack.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('toast--in'));

        if (duration > 0) {
            setTimeout(() => removeToast(toast), duration);
        }

        return toast;
    }

    function confirmDialog(message, options = {}) {
        const title = options.title || 'Подтверждение';
        const okText = options.okText || 'Да';
        const cancelText = options.cancelText || 'Отмена';

        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'ui-overlay';
            overlay.innerHTML = `
                <div class="ui-dialog ui-dialog--confirm" role="dialog" aria-modal="true">
                    <h3 class="ui-dialog__title">${escapeHtml(title)}</h3>
                    <p class="ui-dialog__message">${escapeHtml(message)}</p>
                    <div class="ui-dialog__actions">
                        <button type="button" class="btn btn-secondary ui-dialog__cancel">${escapeHtml(cancelText)}</button>
                        <button type="button" class="btn btn-danger ui-dialog__ok">${escapeHtml(okText)}</button>
                    </div>
                </div>
            `;

            const cleanup = (value) => {
                document.removeEventListener('keydown', onDocKey);
                overlay.remove();
                resolve(value);
            };

            function onDocKey(e) {
                if (e.key === 'Escape') cleanup(false);
            }

            document.addEventListener('keydown', onDocKey);

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cleanup(false);
            });

            overlay.querySelector('.ui-dialog__cancel').addEventListener('click', () => cleanup(false));
            overlay.querySelector('.ui-dialog__ok').addEventListener('click', () => cleanup(true));

            document.body.appendChild(overlay);
            overlay.querySelector('.ui-dialog__cancel').focus();
        });
    }

    function promptDialog(options = {}) {
        const title = options.title || 'Ввод';
        const label = options.label || '';
        const placeholder = options.placeholder || '';
        const defaultValue = options.defaultValue || '';
        const multiline = !!options.multiline;
        const okText = options.okText || 'OK';
        const cancelText = options.cancelText || 'Отмена';

        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'ui-overlay';
            const inputId = 'dlg_' + Math.random().toString(36).slice(2);

            const field = multiline
                ? `<textarea id="${inputId}" class="ui-dialog__input" rows="3" placeholder="${escapeAttr(placeholder)}">${escapeHtml(defaultValue)}</textarea>`
                : `<input type="text" id="${inputId}" class="ui-dialog__input" value="${escapeAttr(defaultValue)}" placeholder="${escapeAttr(placeholder)}" />`;

            overlay.innerHTML = `
                <div class="ui-dialog" role="dialog" aria-modal="true">
                    <h3 class="ui-dialog__title">${escapeHtml(title)}</h3>
                    ${label ? `<label class="ui-dialog__label" for="${inputId}">${escapeHtml(label)}</label>` : ''}
                    ${field}
                    <div class="ui-dialog__actions">
                        <button type="button" class="btn btn-secondary ui-dialog__cancel">${escapeHtml(cancelText)}</button>
                        <button type="button" class="btn btn-primary ui-dialog__ok">${escapeHtml(okText)}</button>
                    </div>
                </div>
            `;

            const cleanup = (value) => {
                document.removeEventListener('keydown', onDocKey);
                overlay.remove();
                resolve(value);
            };

            function onDocKey(e) {
                if (e.key === 'Escape') cleanup(null);
            }

            document.addEventListener('keydown', onDocKey);

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cleanup(null);
            });

            document.body.appendChild(overlay);

            const input = document.getElementById(inputId);
            if (!input) {
                cleanup(null);
                return;
            }

            overlay.querySelector('.ui-dialog__cancel').addEventListener('click', () => cleanup(null));
            overlay.querySelector('.ui-dialog__ok').addEventListener('click', () => {
                const v = multiline ? input.value.trim() : input.value.trim();
                cleanup(v);
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !multiline) {
                    e.preventDefault();
                    overlay.querySelector('.ui-dialog__ok').click();
                }
                if (e.key === 'Escape') {
                    e.stopPropagation();
                    cleanup(null);
                }
            });

            input.focus();
            if (!multiline && input.select) input.select();
        });
    }

    function escapeHtml(s) {
        const d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    }

    function escapeAttr(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;');
    }

    global.Toast = {
        show,
        info: (msg, opts) => show(msg, { ...opts, type: 'info' }),
        success: (msg, opts) => show(msg, { ...opts, type: 'success' }),
        error: (msg, opts) => show(msg, { ...opts, type: 'error' }),
        warning: (msg, opts) => show(msg, { ...opts, type: 'warning' })
    };
    global.confirmDialog = confirmDialog;
    global.promptDialog = promptDialog;
})(typeof window !== 'undefined' ? window : this);
