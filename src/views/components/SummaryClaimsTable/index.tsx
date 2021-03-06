import _ from "lodash";
import * as React from "react";
import "react-table/react-table.css";
import { Claims } from "../ClaimsTable";
import DataTable, { ColumnRowsOpt } from "../DataTable";
import {
  commentsCell,
  getDateRange,
  listCellFormatter,
  listFilterMethod
} from "../SummaryEvalTable";
import { Profile } from "../UserProfile";

export interface ClaimsSummaryData {
  claimTypes: string[];
  comments: string[];
  agentName: string;
  branch: string;
  score: number;
  to: string;
  from: string;
  supervisor: string;
}

export interface Props {
  users: Profile[];
  data: Claims[];
  loggedIn: Profile;
  loading?: boolean;
  error?: string;
}

const columns: ColumnRowsOpt[] = [
  {
    Header: "Claims Summary",
    columns: [
      {
        Header: "Agent Name",
        accessor: "agentName"
      },
      {
        Header: "Claim Type",
        accessor: "claimTypes",
        style: { whiteSpace: "unset" },
        Cell: listCellFormatter("claimTypes"),
        filterMethod: listFilterMethod("claimTypes")
      },
      commentsCell,
      {
        Header: "Score",
        id: "score",
        accessor: "score"
      }
    ]
  }
];

function aggregate(data: Claims[]): ClaimsSummaryData[] {
  const groupedByAgent = _.groupBy(data, obj => obj.agentName);

  const aggregatedByAgent = _.mapValues(groupedByAgent, (values: Claims[]) => {
    const score = _.round(_.meanBy(values, value => value.score), 2);

    const comments = _.uniq(_.flatten(values.map(value => value.comment)));
    const claimTypes = _.uniq(_.flatten(values.map(value => value.claimType)));
    const { from, to } = getDateRange(values.map(value => value.date));

    return {
      agentName: values[0].agentName,
      branch: values[0].branch,
      supervisor: values[0].supervisor,
      claimTypes: _.uniq(claimTypes),
      from,
      to,
      score,
      comments
    };
  });
  return _.values(aggregatedByAgent);
}

export default function SummaryClaimsTable(props: Props) {
  return (
    <DataTable
      data={props.data}
      service="claim"
      users={props.users}
      columns={columns}
      loggedIn={props.loggedIn}
      isSummaryTable={true}
      aggregate={aggregate}
      loading={props.loading}
      error={props.error}
    />
  );
}
