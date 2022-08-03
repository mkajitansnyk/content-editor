import React, {useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Table, TableBody, TablePagination, TableRow} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {useRowSelection, useSort, useExpanded} from '~/SelectorTypes/Picker/reactTable/plugins';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {
    cePickerMode,
    cePickerOpenPaths, cePickerPath,
    cePickerSetPage,
    cePickerSetPageSize, cePickerSetTableViewType
} from '~/SelectorTypes/Picker/Picker2.redux';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import {batchActions} from 'redux-batched-actions';
import {UploadTransformComponent, ContentNotFound, ContentEmptyDropZone, EmptyTable, ContentListHeader, ContentTableWrapper, ContentTypeSelector} from '@jahia/jcontent';
import classes from './ContentTable.scss';

const contentTypeSelectorProps = {
    selector: state => state.contenteditor.picker.tableView,
    reduxActions: {
        setPageAction: page => cePickerSetPage(page),
        setTableViewTypeAction: view => cePickerSetTableViewType(view)
    }
};

const ContentTypeSelectorComp = props => React.createElement(ContentTypeSelector, {...props, ...contentTypeSelectorProps});

export const allowDoubleClickNavigation = nodeType => {
    return (['jnt:folder', 'jnt:contentFolder'].indexOf(nodeType) !== -1);
};

const selector = state => ({
    mode: state.contenteditor.picker.mode.replace('picker-', ''),
    path: state.contenteditor.picker.path,
    pagination: state.contenteditor.picker.pagination,
    tableView: state.contenteditor.picker.tableView
});

const reduxActions = {
    onPreviewSelectAction: () => ({}),
    setOpenPathAction: path => cePickerOpenPaths(getDetailedPathArray(path)),
    setPathAction: path => cePickerPath(path),
    setModeAction: mode => cePickerMode(mode),
    setCurrentPageAction: page => cePickerSetPage(page - 1),
    setPageSizeAction: pageSize => cePickerSetPageSize(pageSize)
};

const clickHandler = {
    handleEvent(e, fcn) {
        e.preventDefault();
        e.stopPropagation();
        if (e.nativeEvent.detail === 1 && !this.timeout) {
            this.timeout = setTimeout(() => {
                this.timeout = undefined;
                fcn();
            }, 300);
        } else if (e.nativeEvent.detail === 2) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
            fcn();
        }
    }
};

export const ContentTable = ({
    rows,
    isContentNotFound,
    totalCount,
    dataCounts,
    isLoading}) => {
    const {t} = useTranslation();
    const {
        mode,
        path,
        pagination,
        tableView
    } = useSelector(selector, shallowEqual);
    const dispatch = useDispatch();
    const isStructuredView = Constants.tableView.mode.STRUCTURED === tableView.viewMode;
    const columns = useMemo(() => Constants.mode.MEDIA === mode ? allColumnData.filter(c => c.id !== 'type') : allColumnData, [mode]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: tableRows,
        prepareRow,
        toggleAllRowsExpanded
    } = useTable(
        {
            columns: columns,
            data: rows
        },
        useRowSelection,
        useSort,
        useExpanded
    );

    useEffect(() => {
        if (isStructuredView) {
            toggleAllRowsExpanded(true);
        }
    }, [rows, isStructuredView, toggleAllRowsExpanded]);

    const doubleClickNavigation = node => {
        const actions = [];

        if (mode === Constants.mode.SEARCH) {
            let newMode;
            if (node.path.indexOf('/files') > -1) {
                newMode = Constants.mode.MEDIA;
            } else if (node.path.indexOf('/contents') > -1) {
                newMode = Constants.mode.CONTENT_FOLDERS;
            } else {
                newMode = Constants.mode.PAGES;
            }

            actions.push(reduxActions.setModeAction(newMode));
        }

        actions.push(reduxActions.setOpenPathAction(node.path));
        actions.push(reduxActions.setPathAction(node.path));
        dispatch(batchActions(actions));
    };

    if (isContentNotFound) {
        return <ContentNotFound columnSpan={allColumnData.length} t={t}/>;
    }

    const typeSelector = mode === Constants.mode.PAGES && dataCounts ? <ContentTypeSelectorComp contentCount={dataCounts.contents} pagesCount={dataCounts.pages}/> : null;

    if (_.isEmpty(rows) && !isLoading) {
        if ((mode === Constants.mode.SEARCH)) {
            return <EmptyTable columnSpan={allColumnData.length} t={t}/>;
        }

        return (
            <>
                {typeSelector}
                <ContentEmptyDropZone mode={mode} path={path}/>
            </>
        );
    }

    return (
        <>
            {typeSelector}
            <UploadTransformComponent uploadTargetComponent={ContentTableWrapper}
                                      uploadPath={path}
                                      mode={mode}
            >
                <Table aria-labelledby="tableTitle"
                       data-cm-role="table-content-list"
                       style={{width: '100%', minWidth: '1100px'}}
                       {...getTableProps()}
                >
                    <ContentListHeader headerGroups={headerGroups}/>
                    <TableBody {...getTableBodyProps()}>
                        {tableRows.map(row => {
                            prepareRow(row);
                            const rowProps = row.getRowProps();
                            const selectionProps = row.getToggleRowSelectedProps();
                            const node = row.original;
                            const className = node.isSelectable ? classes.selectableRow : classes.doubleClickableRow;

                            return (
                                <TableRow key={'row' + row.id}
                                          {...rowProps}
                                          data-cm-role="table-content-list-row"
                                          className={!selectionProps.checked && className}
                                          isHighlighted={selectionProps.checked}
                                          onClick={e => allowDoubleClickNavigation(node.primaryNodeType.name) ? clickHandler.handleEvent(e, selectionProps.onChange) : selectionProps.onChange()}
                                          onDoubleClick={e => allowDoubleClickNavigation(node.primaryNodeType.name) && clickHandler.handleEvent(e, () => doubleClickNavigation(node))}
                                >
                                    {row.cells.map(cell => <React.Fragment key={cell.column.id}>{cell.render('Cell')}</React.Fragment>)}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </UploadTransformComponent>
            {!isStructuredView &&
            <TablePagination totalNumberOfRows={totalCount}
                             currentPage={pagination.currentPage + 1}
                             rowsPerPage={pagination.pageSize}
                             label={{
                                 rowsPerPage: t('jcontent:label.pagination.rowsPerPage'),
                                 of: t('jcontent:label.pagination.of')
                             }}
                             rowsPerPageOptions={[10, 25, 50, 100]}
                             onPageChange={page => dispatch(reduxActions.setCurrentPageAction(page))}
                             onRowsPerPageChange={size => dispatch(reduxActions.setPageSizeAction(size))}
            />}
        </>
    );
};

ContentTable.propTypes = {
    isContentNotFound: PropTypes.bool,
    isLoading: PropTypes.bool,
    rows: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    dataCounts: PropTypes.object
};

export default ContentTable;
