import React, { useState } from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
} from 'react-native';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    /****** Q4: Start Coding here. State the correct IP/port******/
    const response = await fetch('http://10.0.2.2:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
      /****** Q4: Code Ends here******/
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class IssueFilter extends React.Component {
  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <View style={styles.container}>
          <Text style={styles.text}>This is a placeholder for the issue filter.</Text>
        </View>
        {/****** Q1: Code ends here ******/}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#e9ecef', borderRadius: 5, },
  content: { padding: 10, backgroundColor: '#e9ecef', margin:20 },
  header: { height: 50, backgroundColor: '#537791', color: 'white' },
  text: { textAlign: 'center' },
  headerText: { textAlign: 'center', color: 'white', fontWeight: 'bold' },
  dataWrapper: { marginTop: -1 },
  row: {  backgroundColor: '#E7E6E1', borderBlockEndColor: 'gray', borderBottomWidth: 0.5 },
  h2: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, },
  navbar: { flexDirection: 'row', justifyContent: 'space-around', padding: 20},
  input: { height: 40, borderColor: '#ced4da', borderWidth: 1, marginBottom: 10, borderRadius: 4, backgroundColor: '#fff'},
});

const width = [40, 80, 80, 80, 80, 80, 200];

function IssueRow(props) {
  const issue = props.issue;
  {/****** Q2: Coding Starts here. Create a row of data in a variable******/ }
  const rowData = [
    issue.id, 
    issue.status, 
    issue.owner, 
    issue.created.toDateString(), 
    issue.effort, 
    issue.due ? issue.due.toDateString() : '', 
    issue.title];
  {/****** Q2: Coding Ends here.******/ }
  return (
    <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
        <Row data={rowData} style={styles.row} textStyle={styles.text}/>
      {/****** Q2: Coding Ends here. ******/}
    </>
  );
}


function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.id} issue={issue} />
  );

  {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/ }
  const tableHeader = ['ID', 'Status', 'Owner', 'Created', 'Effort', 'Due Date', 'Title'];
  {/****** Q2: Coding Ends here. ******/ }


  return (
    <View style={styles.container}>
      {/****** Q2: Start Coding here to render the table header/rows.**********/}
      <Table>
        <Row data={tableHeader}  style={styles.header} textStyle={styles.headerText}/>
        {issueRows}
      </Table>
      {/****** Q2: Coding Ends here. ******/}
    </View>
  );
}


class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q3: Start Coding here. Create State to hold inputs******/
    this.state = {
      owner: '', 
      title: '', 
      effort: ''
    };
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  handleStateChange = (stateName, value) => {
    this.setState({ [stateName]: value });
  }
  /****** Q3: Code Ends here. ******/

  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
    const issue = {
      owner: this.state.owner,
      title: this.state.title,
      effort: this.state.effort,
      due: new Date(new Date().getTime() + 1000*60*60*24*10)
    };
    this.props.createIssue(issue);
    this.setState({ owner: '', title: '', effort: '' });
    /****** Q3: Code Ends here. ******/
  }

  render() {
    return (
      <View style={styles.container}> 
        {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={styles.h2}> Add a new issue: </Text>
        < TextInput
          placeholder='Owner'
          value={this.state.owner}
          onChangeText={(value) => this.handleStateChange('owner', value)}
          style={styles.input}
          />
        < TextInput
          placeholder='Title'
          value={this.state.title}
          onChangeText={(value) => this.handleStateChange('title', value)}
          style={styles.input}
          />
        < TextInput
          placeholder='Effort'
          value={this.state.effort}
          onChangeText={(value) => this.handleStateChange('effort', value)}
          style={styles.input}
          />
        <Button onPress={this.handleSubmit} title="Add" />
        {/****** Q3: Code Ends here. ******/}
      </View>
    );
  }
}

class BlackList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q4: Start Coding here. Create State to hold inputs******/
    this.state = {
      name: ''
    };
    /****** Q4: Code Ends here. ******/
  }
  /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  handleStateChange = (stateName, value) => {
    this.setState({ [stateName]: value });
  }
  /****** Q4: Code Ends here. ******/

  async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    await this.props.addToBlacklist(this.state.name);
    this.setState({ name: '' });
    /****** Q4: Code Ends here. ******/
  }

  render() {
    return (
      <View style={styles.container}>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={styles.h2}> Add to Blacklist: </Text>
        <TextInput
          placeholder='Name'
          value={this.state.name}
          onChangeText={(value) => this.handleStateChange('name', value)}
          style={styles.input}
        />
        <Button onPress={this.handleSubmit} title="Add" />
        {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { 
      issues: [],
      selector: 1
     };
    this.createIssue = this.createIssue.bind(this);
    this.addToBlacklist = this.addToBlacklist.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      alert('Successfully added issue');
      this.loadData();
    }
  }

  async addToBlacklist(nameInput) {
    const query = `mutation addToBlacklist($nameInput: String!) {
        addToBlacklist(nameInput: $nameInput) 
    }`;

    const data = await graphQLFetch(query, { nameInput });
    if (data) {
      alert('Added to blacklist');
    }
  }

  setSelector = (value) => {
    this.setState({ selector: value });
  }


  render() {
    return (
      <SafeAreaView>
        {/* nav bar */}
        <View style={styles.navbar}>
          <Button title="IssueFilter" onPress={() => this.setSelector(1)} />
          <Button title="IssueTable" onPress={() => this.setSelector(2)} />
          <Button title="IssueAdd" onPress={() => this.setSelector(3)} />
          <Button title="BlackList" onPress={() => this.setSelector(4)} />
        </View>
      <ScrollView style={styles.content}>
        {/****** Q1: Start Coding here. ******/}
        {
          this.state.selector === 1 && <IssueFilter />
        }
        {/****** Q1: Code ends here ******/}


        {/****** Q2: Start Coding here. ******/}
        {
          this.state.selector === 2 && <IssueTable issues={this.state.issues} />
        }
        {/****** Q2: Code ends here ******/}


        {/****** Q3: Start Coding here. ******/}
        {
          this.state.selector === 3 && <IssueAdd createIssue={this.createIssue} />
        }
        {/****** Q3: Code Ends here. ******/}

        {/****** Q4: Start Coding here. ******/}
        {
          this.state.selector === 4 && <BlackList addToBlacklist={this.addToBlacklist} />
        }
        {/****** Q4: Code Ends here. ******/}
      </ScrollView>
    </SafeAreaView>
    );
  }
}
