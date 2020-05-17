import React from 'react';
import MaterialTable from 'material-table';

const Table = props => {
    const {
        name,
        columns,
        data,
        search = true,
        exportButton = true,
        detailPanel,
        showTitle = true,
        paging = true,
        pageSize = 5,
        filtering = true,
        grouping = false,
        style,
        editable,
        actions,
        editTooltip = 'Edit',
        addTooltip = 'Add',
        deleteTooltip = 'Delete',
        selection,
        selectionProps,
        rowStyle
    } = props;
    return (
        <MaterialTable
            title={name}
            columns={columns}
            data={data}
            editable={editable }
            actions={actions}
            options={{
                filtering,
                search,
                selection,
                selectionProps,
                exportButton,
                showTitle: showTitle,
                toolbar: showTitle,
                paging,
                pageSize,
                headerStyle: style,
                exportAllData: true,
                grouping,
                actionsColumnIndex: -1,
                rowStyle
            }}
            localization={{
                body: {
                    editTooltip,
                    addTooltip,
                    deleteTooltip
                }
            }}
            style={style}
            detailPanel={detailPanel}
        />
    );
};

export default Table;