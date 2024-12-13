import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const QuizzApp = () => {
  const [questionIndex, setQuestionIndex] = React.useState(1);
  const Question = [
    {
      _id: '673837059c6fcbba05fe6fd1',
      question: 'E-cigarettes and vaping help in quitting smoking',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 24,
      event: '2',
      createdAt: '2024-11-16T06:09:09.877Z',
      updatedAt: '2024-11-16T06:09:09.877Z',
    },
    {
      _id: '673836fa9c6fcbba05fe6fc7',
      question: 'Smokers had more immunity against Corona Virus',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 23,
      event: '2',
      createdAt: '2024-11-16T06:08:58.733Z',
      updatedAt: '2024-11-16T06:08:58.733Z',
    },
    {
      _id: '673836ef9c6fcbba05fe6fc5',
      question:
        'Most of the smokers live longer and health complications are rare',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 22,
      event: '2',
      createdAt: '2024-11-16T06:08:47.632Z',
      updatedAt: '2024-11-16T06:08:47.632Z',
    },
    {
      _id: '673836e49c6fcbba05fe6fae',
      question: 'Smoking turns my partner on1',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 21,
      event: '2',
      createdAt: '2024-11-16T06:08:36.721Z',
      updatedAt: '2024-11-16T10:10:05.078Z',
    },
    {
      _id: '673836d79c6fcbba05fe6fa5',
      question: 'Smoking is cool and stylish',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 20,
      event: '2',
      createdAt: '2024-11-16T06:08:23.405Z',
      updatedAt: '2024-11-16T06:08:23.405Z',
    },
    {
      _id: '673836ca9c6fcbba05fe6f8f',
      question: 'Cigarette helps me bond well with others',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 19,
      event: '2',
      createdAt: '2024-11-16T06:08:10.575Z',
      updatedAt: '2024-11-16T06:08:10.575Z',
    },
    {
      _id: '673835ce9c6fcbba05fe6f3c',
      question: 'Cigarette helps me cope better with life',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 18,
      event: '1',
      createdAt: '2024-11-16T06:03:58.661Z',
      updatedAt: '2024-11-16T06:03:58.661Z',
    },
    {
      _id: '673835c19c6fcbba05fe6f3a',
      question: 'Cigarette is my best friend',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 17,
      event: '1',
      createdAt: '2024-11-16T06:03:45.943Z',
      updatedAt: '2024-11-16T06:03:45.943Z',
    },
    {
      _id: '673835b69c6fcbba05fe6f38',
      question: 'Even if I quit smoking for some days, I will surely relapse',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 16,
      event: '1',
      createdAt: '2024-11-16T06:03:34.508Z',
      updatedAt: '2024-11-16T06:03:34.508Z',
    },
    {
      _id: '673835a99c6fcbba05fe6f36',
      question: 'Once a smoker, always a smoker',
      question_type: 'radio',
      options: [
        {
          value: '1',
          point: '1',
        },
        {
          value: '2',
          point: '2',
        },
        {
          value: '3',
          point: '3',
        },
        {
          value: '4',
          point: '4',
        },
        {
          value: '5',
          point: '5',
        },
        {
          value: '6',
          point: '6',
        },
        {
          value: '7',
          point: '7',
        },
        {
          value: '8',
          point: '8',
        },
        {
          value: '9',
          point: '9',
        },
        {
          value: '10',
          point: '10',
        },
      ],
      order: 15,
      event: '1',
      createdAt: '2024-11-16T06:03:21.245Z',
      updatedAt: '2024-11-16T06:03:21.245Z',
    },
  ];
  const renderItem = ({item, index}) => {
    if (index != questionIndex) {
      return null;
    }
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}}>
          <Text>{item?.question}</Text>
         
         {
            questionIndex == Question.length - 1

         } <TouchableOpacity
            onPress={() => {
              setQuestionIndex(questionIndex + 1);
            }}
            style={{
              backgroundColor: '#85388d',
              padding: 10,
            }}>
            <Text style={{
                color:'#fff',
                padding:10
            }}>Next</Text>
          </TouchableOpacity>
          {questionIndex == Question.length - 1 && (
            <TouchableOpacity
              onPress={() => {
                setQuestionIndex(questionIndex - 1);
              }}
              style={{
                backgroundColor: '#85388d',
                padding: 10,
              }}>
              <Text>Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <Text></Text>
      </View>
      <FlatList
        data={Question}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

export default QuizzApp;

const styles = StyleSheet.create({});
