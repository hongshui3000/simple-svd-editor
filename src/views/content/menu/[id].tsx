import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';
import { FormikValues } from 'formik';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { CSSObject } from '@emotion/core';
import * as Yup from 'yup';

import { useTheme, scale, Layout, Button } from '@scripts/gds';
import { ErrorMessages } from '@scripts/constants';

import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';

import TrashIcon from '@icons/small/trash.svg';
import EditIcon from '@icons/small/edit.svg';
import PlusIcon from '@icons/small/plus.svg';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';

import { useMenu, useUpdateMenuTree } from '@api/content/menu';
import { MenuTreeItem } from '@api/content/types/menus';

const MenuEditPopup = ({
    isOpen,
    onRequestClose,
    editedItem = null,
    onSubmit,
}: {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: (values: FormikValues) => void;
    editedItem?: MenuTreeItem | null;
}) => (
    <Popup
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={editedItem ? 'Редактирование пункта меню' : 'Создание пункта меню'}
        popupCss={{ minWidth: scale(60) }}
    >
        <Form
            onSubmit={onSubmit}
            initialValues={{
                name: editedItem ? editedItem.name : '',
                url: editedItem ? editedItem.url : '',
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string().required(ErrorMessages.REQUIRED),
                url: Yup.string().required(ErrorMessages.REQUIRED),
            })}
        >
            <Form.FastField name="name" label="Название*" css={{ marginBottom: scale(2) }} />

            <Form.FastField name="url" label="Ссылка*" css={{ marginBottom: scale(2) }} />

            <Button type="submit">Применить</Button>
        </Form>
    </Popup>
);

const MenuItemComponent = ({
    item,
    subItems,
    onDelete,
    onEdit,
}: {
    item: MenuTreeItem;
    subItems: MenuTreeItem[];
    onDelete: () => any;
    onEdit: (val: FormikValues) => any;
}) => {
    const { colors } = useTheme();

    const subItemStyle: CSSObject = {
        paddingTop: scale(1),
        paddingBottom: scale(1),
        borderBottom: `1px solid ${colors?.grey400}`,
    };

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editedItem, setEditedItem] = useState<MenuTreeItem | null>(null);
    const [parentItem, setParentItem] = useState<MenuTreeItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const [subMenu, setSubMenu] = useState(subItems);

    const reorderItems = useCallback(
        (startIndex: number, endIndex: number) => {
            const newData = [...subMenu];
            const [movedRow] = newData.splice(startIndex, 1);
            newData.splice(endIndex, 0, movedRow);
            if (setSubMenu) setSubMenu(newData);

            item.children = newData;
        },
        [subMenu, setSubMenu, item]
    );

    const onDragEnd = useCallback(
        ({ source, destination }: DropResult) => {
            if (!destination || destination.index === source.index) return;
            reorderItems(source.index, destination.index);
        },
        [reorderItems]
    );

    return (
        <>
            <Block css={{ marginTop: scale(2) }}>
                <Block.Header>
                    <Layout cols={2} align="center" css={{ width: '100%' }}>
                        <Layout.Item>
                            <b>
                                {item.name} ({item.url})
                            </b>
                        </Layout.Item>

                        <Layout.Item justify="end">
                            <Layout cols={['auto', 'auto']} gap={scale(2)}>
                                <Button
                                    theme="outline"
                                    Icon={EditIcon}
                                    hidden
                                    onClick={() => {
                                        setEditedItem(item);
                                        setIsPopupOpen(true);
                                    }}
                                >
                                    Изменить
                                </Button>
                                <Button theme="secondary" Icon={TrashIcon} hidden onClick={onDelete}>
                                    Удалить
                                </Button>
                            </Layout>
                        </Layout.Item>
                    </Layout>
                </Block.Header>

                <Block.Body css={subMenu.length === 0 && { padding: 0, paddingTop: scale(2) }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={`droppable-${item.name}`}>
                            {provided => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {subMenu.length !== 0 &&
                                        subMenu.map((subItem, index) => (
                                            <Draggable
                                                draggableId={`draggable-${item.name}-${index}`}
                                                key={subItem.name + subItem.url}
                                                index={index}
                                            >
                                                {draggableProvided => (
                                                    <div
                                                        ref={draggableProvided.innerRef}
                                                        {...draggableProvided.dragHandleProps}
                                                        {...draggableProvided.draggableProps}
                                                        key={`${subItem.name}-${subItem.url}`}
                                                    >
                                                        <Layout cols={2} align="center" css={subItemStyle}>
                                                            <Layout.Item col={1}>
                                                                {index + 1}. {subItem.name} ({subItem.url})
                                                            </Layout.Item>

                                                            <Layout.Item col={1} justify="end">
                                                                <Layout cols={['auto', 'auto']} gap={scale(2)}>
                                                                    <Button
                                                                        theme="outline"
                                                                        Icon={EditIcon}
                                                                        hidden
                                                                        onClick={() => {
                                                                            setEditedItem(subItem);
                                                                            setIsPopupOpen(true);
                                                                        }}
                                                                    >
                                                                        Изменить
                                                                    </Button>
                                                                    <Button
                                                                        theme="secondary"
                                                                        Icon={TrashIcon}
                                                                        hidden
                                                                        onClick={() => setItemToDelete(index)}
                                                                    >
                                                                        Удалить
                                                                    </Button>
                                                                </Layout>
                                                            </Layout.Item>
                                                        </Layout>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Block.Body>

                <Button
                    theme="primary"
                    css={{ marginLeft: scale(3), marginBottom: scale(2) }}
                    Icon={PlusIcon}
                    onClick={() => {
                        setParentItem(item);
                        setIsPopupOpen(true);
                    }}
                >
                    Добавить подпункт
                </Button>
            </Block>
            <Popup
                isOpen={itemToDelete !== null}
                onRequestClose={() => setItemToDelete(null)}
                title="Вы уверены, что хотите удалить элемент меню?"
                popupCss={{ minWidth: scale(50) }}
            >
                {itemToDelete !== null ? (
                    <p css={{ marginBottom: scale(2) }}>
                        {subMenu[itemToDelete].name} ({subMenu[itemToDelete].url})
                    </p>
                ) : (
                    ''
                )}
                <Button
                    type="submit"
                    onClick={() => {
                        if (itemToDelete !== null) {
                            item.children.splice(itemToDelete, 1);

                            setItemToDelete(null);
                        }
                    }}
                >
                    Удалить
                </Button>
            </Popup>
            <MenuEditPopup
                isOpen={isPopupOpen}
                onRequestClose={() => {
                    setIsPopupOpen(false);
                    setEditedItem(null);
                }}
                onSubmit={val => {
                    if (editedItem) {
                        const newItem = {
                            ...editedItem,
                            ...val,
                        };
                        setEditedItem(newItem);

                        onEdit(val);
                    } else {
                        parentItem?.children.push({
                            name: val.name,
                            url: val.url,
                            children: [],
                        });
                    }

                    setIsPopupOpen(false);
                    setEditedItem(null);
                }}
                editedItem={editedItem}
            />
        </>
    );
};

const MenuDetails = () => {
    const { colors } = useTheme();
    const {
        query: { id },
    } = useRouter();

    const {
        data: apiMenu,
        isIdle,
        isLoading,
    } = useMenu({
        sort: ['id'],
        include: ['items'],
        filter: {
            id: +(id || 1),
        },
    });

    interface MenuInfo {
        id: number;
        code: string;
        title: string;
        items: MenuTreeItem[];
    }

    const [menuInfo, setMenuInfo] = useState<MenuInfo>({
        id: 0,
        code: '',
        title: '',
        items: [],
    });

    const mutateMenuInfo = (data: Partial<MenuInfo>) =>
        setMenuInfo({
            ...menuInfo,
            ...data,
        });

    useEffect(() => {
        const { id: mId, code, name, itemsTree } = apiMenu?.data || {};
        setMenuInfo({
            id: mId || 0,
            code: code || '',
            title: name || '',
            items: itemsTree || [],
        });
    }, [apiMenu?.data]);

    const formCss: CSSObject = {
        paddingBottom: scale(3),
        marginBottom: scale(2),
        borderBottom: `1px solid ${colors?.grey600}`,
    };

    const [isSaving, setIsSaving] = useState(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const [showSaved, setShowSaved] = useState(false);

    const updateMenuTree = useUpdateMenuTree();

    let btnText = 'Сохранить';
    if (isSaving) btnText = 'Обработка...';
    if (showSaved) btnText = 'Сохранено!';

    return (
        <PageWrapper h1={menuInfo.title} isLoading={isLoading || isIdle}>
            <Form initialValues={{ items: menuInfo.items }} enableReinitialize onSubmit={() => {}} css={formCss}>
                <Layout cols={2} align="center" css={{ marginTop: scale(3) }}>
                    <Layout.Item col={1}>
                        <h3> Пункты меню </h3>
                    </Layout.Item>
                </Layout>

                <Form.Field name="items">
                    {menuInfo.items.map((item, index) => (
                        <MenuItemComponent
                            item={item}
                            subItems={item.children || []}
                            key={index}
                            onDelete={() => setItemToDelete(index)}
                            onEdit={formData => {
                                const clone = menuInfo.items.map((e, i) =>
                                    i === index ? (formData as MenuTreeItem) : { ...e }
                                );

                                mutateMenuInfo({
                                    items: [...clone],
                                });
                            }}
                        />
                    ))}
                </Form.Field>
            </Form>

            <Layout cols={['auto', 'auto', 1]} gap={scale(2)}>
                <Button theme="primary" Icon={PlusIcon} onClick={() => setIsPopupOpen(true)}>
                    Добавить пункт
                </Button>
                <Button
                    theme="outline"
                    disabled={isSaving}
                    onClick={() => {
                        setIsSaving(true);
                        updateMenuTree.mutateAsync(menuInfo).then(() => {
                            setIsSaving(false);

                            setShowSaved(true);

                            setTimeout(() => {
                                setShowSaved(false);
                            }, 1000);
                        });
                    }}
                >
                    {btnText}
                </Button>
            </Layout>

            <Popup
                isOpen={itemToDelete !== null}
                onRequestClose={() => setItemToDelete(null)}
                title="Вы уверены, что хотите удалить элемент меню?"
                popupCss={{ minWidth: scale(50) }}
            >
                {itemToDelete !== null ? (
                    <p css={{ marginBottom: scale(2) }}>
                        {menuInfo.items[itemToDelete].name} ({menuInfo.items[itemToDelete].url})
                    </p>
                ) : (
                    ''
                )}
                <Button
                    type="submit"
                    onClick={() => {
                        if (itemToDelete !== null) {
                            mutateMenuInfo({
                                items: menuInfo.items.filter((e, i) => i !== itemToDelete),
                            });
                            setItemToDelete(null);
                        }
                    }}
                >
                    Удалить
                </Button>
            </Popup>

            <MenuEditPopup
                isOpen={isPopupOpen}
                onRequestClose={() => {
                    setIsPopupOpen(false);
                }}
                onSubmit={(val: FormikValues) => {
                    const clone = menuInfo.items.map(e => ({ ...e }));

                    mutateMenuInfo({
                        items: [
                            ...clone,
                            {
                                name: val.name,
                                url: val.url,
                                children: [],
                            },
                        ],
                    });

                    setIsPopupOpen(false);
                }}
            />
        </PageWrapper>
    );
};

export default MenuDetails;
