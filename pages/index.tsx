import React from "react";
import { connect } from "react-redux";
import Home from "src/views/templates/Index";

const page = () => <Home />;

export default connect()(page);
