export const hideOnEsc = {
    name: 'hideOnEsc',
    defaultValue: true,
    fn({ hide }: any) {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                hide();
            }
        }

        return {
            onShow() {
                document.addEventListener('keydown', onKeyDown);
            },
            onHide() {
                document.removeEventListener('keydown', onKeyDown);
            },
        };
    },
};
