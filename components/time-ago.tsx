import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface TimeAgoProps {
  date: Date | string;
}

const TimeAgo = ( { date }: TimeAgoProps) => {
 // const relativeTime = formatDistanceToNow(new Date(date), { addSuffix: true });

  const now = new Date();
  const targetDate = new Date(date);
  
  const distance = formatDistanceToNow(targetDate, { addSuffix: true });

  if (now.getTime() - targetDate.getTime() < 60000) {
    return '1 minute ago';
  }

  // Adjust for "about x hours ago" to "x hours ago"
  if (distance.startsWith('about')) {
    return distance.replace('about ', '');
  }

  return distance;
  //return <span>{relativeTime}</span>;
};

export default TimeAgo;