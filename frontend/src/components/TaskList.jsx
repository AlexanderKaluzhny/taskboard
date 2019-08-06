/* eslint-disable react/prefer-stateless-function */
import React from 'react';

class TaskList extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-12 task-list">
          <table className="table table-bordered">
            <tbody>
              <tr id="task-table-header" className="active">
                <th className="text-center">Name</th>
                <th className="text-center">Owner</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TaskList;
