<div class="content-toolbar content-box clearfix">
    <div class="control-left">
        <button class="btn btn-control btn-sm" data-id="new_button">New</button>
    </div>
    <div class="control-right">
        <div class="toolbar-search">
            <form data-id="search_form">
                <input type="text" class="form-control input-sm" disabled="true" placeholder="Search..." data-id="search_box" />
                <button data-id="search_btn">
                    <i class="fa fa-search"></i>
                </button>
            </form>
        </div>
    </div>
</div>
<div>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Published</th>
                <th>Options</th>
            </tr>
        </thead>
        <tbody data-id="list">
            <!--
            <tr>
                <td>Uncategorized</td>
                <td>Immutable default category.</td>
                <td>Yes</td>
                <td>
                    <button class="btn btn-primary btn-xs"><i class="fa fa-pencil"></i></button>
                    <button class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
                </td>
            </tr>
            -->
        </tbody>
    </table>
</div>