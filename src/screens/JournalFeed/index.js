import React, { Component } from 'react'
import { Icon } from 'native-base'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Animated
} from 'react-native'
import { Octicons, Ionicons } from '@expo/vector-icons'
import StatusBumper from '../../components/StatusBumper'
import moment from 'moment'
import { db } from '../../../App'
import { connect, dispatch } from 'react-redux'
import { setJournalEntries } from '../../redux/actions/journal-actions'
import { Background } from '../../components/Background'
import { LinearGradient } from 'expo'
import { INDICES } from '../index'
class JournalFeed extends Component {

  constructor(props) {
    super(props)
    this.state = {
      entries: [],
      text: '',
      sortedDates: {},
      searchText: '',
      editVisible: true,
      slideAnim: new Animated.Value(15),
      scrollPositionPercent: 0
    }
    this.groupedByDate = {}
    this.editButtonVisibleTimeout
  }
  componentWillUnmount () {
    clearTimeout(this.editButtonVisibleTimeout)
  }
  componentDidMount () {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists entries (id integer primary key not null, date text, entry text);'
      )
    })
    this.editButtonVisibleTimeout = setTimeout(this.beginSlideOutAnimation, 2500)
    this.sortEntries()
  }
  beginSlideOutAnimation = () => {
    this.setState({ editVisible: false }, () => {
      Animated.timing(
        this.state.slideAnim,
        {
          toValue: -80,
          duration: 250
        }
      ).start()
    })
  }
  beginSlideInAnimation = () => {
    if (!this.state.editVisible) {
      this.setState({ editVisible: true }, () => {
        Animated.timing(
          this.state.slideAnim,
          {
            toValue: 15,
            duration: 250
          }
        ).start()
      })
    }
  }
  componentWillReceiveProps (props) {
    this.setState({ sortedDates: {} },
      () => this.sortEntries(props)
    )
  }
  searchEntries = (e) => {
    this.setState({ searchText: e })
    const newEntries = this.props.entries.filter(value => {
      return value.entry.toLowerCase().indexOf(e.toLowerCase()) > -1
    })
    this.sortEntries({ entries: newEntries })
  }
  sortEntries (props = this.props) {
    this.groupedByDate = {}
    props.entries.sort((a, b) => b.date - a.date).map(this.groupByDate)
    this.setState({ sortedDates: this.groupedByDate })
  }
  createEntry = () => {
    clearTimeout(this.editButtonVisibleTimeout)
    this.props.changeIndex(INDICES.prompt)
  }
  groupByDate = (value, index, array) => {
    let date = moment(parseInt(value.date))
    let day = date.format('YYYY-MM-DD')
    this.groupedByDate[day] = this.groupedByDate[day] || []
    this.groupedByDate[day].push(value)
  }
  handleTextChange = (value) => {
    this.setState({ text: value })
  }
  editEntry = (value) => {
    clearTimeout(this.editButtonVisibleTimeout)
    this.props.changeIndex(INDICES.prompt, value)
  }
  setEditButtonVisible = () => {
    clearTimeout(this.editButtonVisibleTimeout)
    this.beginSlideInAnimation()
    this.editButtonVisibleTimeout = setTimeout(this.beginSlideOutAnimation, 2000)
  }
  render () {
    const screenHeight = Dimensions.get('window').height
    let { sortedDates } = this.state
    const entryCards = Object.keys(sortedDates).map((value, index) => {
      const entriesPerDay = sortedDates[value].map((val, idx) => {
        return (
          <TouchableOpacity key={idx} onPress={() => this.editEntry(val)}>
            <Text style={this.styles.entryText}>{val.entry}</Text>
          </TouchableOpacity>
        )
      })
      return (
        <View key={index} style={this.styles.dateContainer}>
          <View style={this.styles.dateHeaderContainer}>
            <Text style={this.styles.monthText}>{moment(value).format('MMM')}</Text>
            <Text style={this.styles.dayText}>{moment(value).format('DD')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            {entriesPerDay}
          </View>
        </View>
      )
    })
    return (
      <Background
        colors={['#4E7AC7', '#35478C']}
      >
        <View style={this.styles.searchBar}>
          <Ionicons name='ios-search-outline' style={this.styles.searchIcon} size={22} />
          <TextInput
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder='Search'
            placeholderTextColor='white'
            style={this.styles.searchInput}
            onChangeText={this.searchEntries}
            value={this.state.searchText}
          />
          {this.state.searchText
            ? <TouchableOpacity onPress={() => { this.searchEntries('') }}>
              <Ionicons name='ios-close-circle-outline' style={this.styles.searchIcon} size={22} />
            </TouchableOpacity>
            : <View />}
        </View>
        <ScrollView
          style={this.styles.scroll}
          collapsable={false}
          contentContainerStyle={this.styles.innerView}
          onTouchStart={this.setEditButtonVisible}
          showsVerticalScrollIndicator={false}
          onScroll={this.handleScroll}
          onLayout={this.handleLayout}
          onContentSizeChange={this.handleContentSizeChange}
        >
          {entryCards}
        </ScrollView>
        <Animated.View style={[this.styles.editTouchable, { bottom: this.state.slideAnim }]} onPress={this.createEntry}>
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={this.createEntry}>
            <LinearGradient
              colors={['#E16868', '#EF508D']}
              style={this.styles.editButton}
            >
              <Octicons name='pencil' style={this.styles.editIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Background>
    )
  }
  styles = StyleSheet.create({
    headerText: {
      fontSize: 22,
      textAlign: 'center',
      fontFamily: 'Lato',
      color: 'white',
    },
    monthHeader: {
      textShadowColor: '#211412',
      marginBottom: 7,
      textShadowOffset: { width: 2, height: 2 },
      fontSize: 30,
      color: 'orange',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    monthGroup: {
      marginBottom: 20
    },
    innerView: {
      paddingTop: 10,
      paddingHorizontal: 20,
    },
    editButton: {
      height: 70,
      width: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      margin: 7,
    },
    editTouchable: {
      position: 'absolute',
      bottom: 15,
      right: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editIcon: {
      color: 'white',
      fontSize: 30,
      backgroundColor: 'rgba(0,0,0,0)'
    },
    dateContainer: {
      marginBottom: 15,
      flexDirection: 'row'
    },
    dateHeaderContainer: {
      flexDirection: 'column',
      marginRight: 15,
    },
    monthText: {
      color: 'white',
      fontFamily: 'Raleway',
      fontSize: 22,
      marginTop: 0,
      marginBottom: -8,
      backgroundColor: 'rgba(0,0,0,0)'
    },
    dayText: {
      color: 'white',
      fontFamily: 'RalewaySemiBold',
      fontSize: 35,
      backgroundColor: 'rgba(0,0,0,0)'
    },
    entryText: {
      color: 'white',
      fontFamily: 'Lato',
      fontSize: 22,
      marginBottom: 7,
      backgroundColor: 'rgba(0,0,0,0)'
    },
    searchBar: {
      borderColor: 'rgba(0,0,0,0)',
      backgroundColor: 'rgba(255,255,255,0.2)',
      height: 36,
      borderRadius: 18,
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInput: {
      color: 'white',
      fontFamily: 'RalewayLight',
      fontSize: 22,
      flex: 1,
    },
    searchIcon: {
      color: 'white',
      marginRight: 15
    }
  })
}

function mapStateToProps (state, ownProps) {
  return {
    entries: state.Journals.entries
  }
}
mapDispatchToProps = (dispatch) => ({
  setEntries: (entries) => dispatch(setJournalEntries(entries))
})
export default connect(mapStateToProps, mapDispatchToProps)(JournalFeed)