// Database of all stretches
const stretches = [
  // NECK STRETCHES
  {
    id: 'forward-backward-bend',
    title: 'Forward Backward Neck Bend',
    description: 'Gently stretch your neck forward and backward to relieve tension and improve mobility.',
    videoFile: 'forward-backward-bend.mp4',
    duration: 30, // seconds
    difficulty: 'easy',
    bodyPart: 'neck',
    environments: ['office', 'home'],
    benefits: ['Reduces neck tension', 'Improves neck mobility', 'Relieves upper back strain'],
    instructions: [
      'Start in a seated position with your back straight',
      'Slowly lower your chin to your chest, feeling the stretch in your neck',
      'Hold for 5 seconds',
      'Gradually tilt your head back, looking up at the ceiling',
      'Hold for 5 seconds',
      'Return to neutral position',
      'Repeat 5 times'
    ],
    tips: 'Move slowly and gently. Stop if you feel any pain.',
    isPremium: false
  },
  {
    id: 'lean-back',
    title: 'Neck Lean Back',
    description: 'A gentle stretch to release tension in the front of your neck and improve posture.',
    videoFile: 'lean-back.mp4',
    duration: 30,
    difficulty: 'easy',
    bodyPart: 'neck',
    environments: ['office', 'home'],
    benefits: ['Reduces neck strain', 'Counteracts forward head posture', 'Opens chest'],
    instructions: [
      'Sit or stand with your spine straight',
      'Gently lean your head back, looking toward the ceiling',
      'Feel the stretch along the front of your neck',
      'Hold for 15-20 seconds',
      'Return to neutral position',
      'Repeat 2-3 times'
    ],
    tips: 'Avoid pushing too far. The movement should be comfortable.',
    isPremium: false
  },

  // ARMS & SHOULDERS STRETCHES
  {
    id: 'arm-circle',
    title: 'Arm Circles',
    description: 'Circular movements that mobilize your shoulder joints and warm up the upper body.',
    videoFile: 'arm-circle.mp4',
    duration: 45,
    difficulty: 'easy',
    bodyPart: 'shoulders',
    environments: ['home'],
    benefits: ['Increases shoulder mobility', 'Warms up upper body', 'Improves circulation'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Extend arms out to the sides at shoulder height',
      'Make small circles with your arms, gradually increasing the size',
      'After 10 circles, reverse direction',
      'Continue for 45 seconds'
    ],
    tips: 'Keep your core engaged and maintain good posture throughout.',
    isPremium: false
  },
  {
    id: 'arm-extension',
    title: 'Arm Extension',
    description: 'A simple stretch that targets the triceps and shoulders.',
    videoFile: 'arm-extension.mp4',
    duration: 30,
    difficulty: 'easy',
    bodyPart: 'arms',
    environments: ['office', 'home'],
    benefits: ['Stretches triceps', 'Releases shoulder tension', 'Can be done seated'],
    instructions: [
      'Raise one arm overhead',
      'Bend your elbow, letting your hand drop behind your head',
      'Use your other hand to gently pull the elbow back and down',
      'Hold for 15 seconds',
      'Switch arms and repeat'
    ],
    tips: 'For deeper stretch, try to bring your hand as far down your back as comfortable.',
    isPremium: false
  },
  {
    id: 'arm-raise',
    title: 'Arm Raise',
    description: 'A movement that opens the chest and stretches the shoulders.',
    videoFile: 'arm-raise.mp4',
    duration: 30,
    difficulty: 'easy',
    bodyPart: 'shoulders',
    environments: ['office', 'home'],
    benefits: ['Opens chest', 'Improves posture', 'Counteracts computer hunching'],
    instructions: [
      'Stand or sit with back straight',
      'Slowly raise both arms in front, then up overhead',
      'Feel the stretch through your shoulders and upper back',
      'Lower arms back down slowly',
      'Repeat 5-8 times'
    ],
    tips: 'Coordinate movement with your breath - inhale as you raise arms, exhale as you lower them.',
    isPremium: false
  },
  {
    id: 'tricep-stretch',
    title: 'Tricep Stretch',
    description: 'An effective stretch targeting the back of your arms.',
    videoFile: 'tricep-stretch.mp4',
    duration: 30,
    difficulty: 'easy',
    bodyPart: 'arms',
    environments: ['office', 'home'],
    benefits: ['Relieves tension in triceps', 'Improves arm mobility', 'Quick and effective'],
    instructions: [
      'Raise your right arm and bend it behind your head',
      'Use your left hand to gently pull your right elbow to the left',
      'Hold for 15 seconds',
      'Switch arms and repeat'
    ],
    tips: 'Keep your shoulders relaxed and away from your ears during the stretch.',
    isPremium: false
  },

  // LEGS STRETCHES
  {
    id: 'calf-stretch',
    title: 'Calf Stretch',
    description: 'A great stretch for the back of your lower legs, especially after prolonged sitting.',
    videoFile: 'calf-stretch.mp4',
    duration: 30,
    difficulty: 'easy',
    bodyPart: 'legs',
    environments: ['office', 'home'],
    benefits: ['Reduces calf tightness', 'Improves ankle mobility', 'Helps prevent foot cramps'],
    instructions: [
      'Stand facing a wall',
      'Place hands on the wall at shoulder height',
      'Step one foot back, keeping it straight with heel on floor',
      'Bend your front knee slightly',
      'Feel the stretch in your back leg\'s calf',
      'Hold for 20 seconds',
      'Switch legs and repeat'
    ],
    tips: 'Keep both feet pointing forward and back heel down for maximum stretch.',
    isPremium: false
  },
  {
    id: 'quad-stretch',
    title: 'Quad Stretch',
    description: 'An essential stretch for the front of your thighs.',
    videoFile: 'quad-stretch.mp4',
    duration: 30,
    difficulty: 'moderate',
    bodyPart: 'legs',
    environments: ['home'],
    benefits: ['Relieves quad tightness', 'Improves knee flexibility', 'Reduces lower back strain'],
    instructions: [
      'Stand next to a wall or chair for balance',
      'Bend one knee and bring your foot toward your buttocks',
      'Grasp your ankle with the same-side hand',
      'Keep knees close together and stand tall',
      'Hold for 15-20 seconds',
      'Switch legs and repeat'
    ],
    tips: 'If you have knee problems, be extra gentle with this stretch.',
    isPremium: false
  },
  {
    id: 'lunge',
    title: 'Basic Lunge Stretch',
    description: 'A deep stretch for hip flexors and quadriceps.',
    videoFile: 'lunge.mp4',
    duration: 45,
    difficulty: 'moderate',
    bodyPart: 'legs',
    environments: ['home'],
    benefits: ['Stretches hip flexors', 'Opens groin', 'Strengthens legs'],
    instructions: [
      'Start in standing position',
      'Take a large step forward with one foot',
      'Bend both knees, lowering until front thigh is parallel to floor',
      'Keep back knee off floor and heel lifted',
      'Hold for 20 seconds',
      'Switch legs and repeat'
    ],
    tips: 'Ensure your front knee stays above your ankle, not pushing forward past your toes.',
    isPremium: false
  },

  // CORE & BACK STRETCHES
  {
    id: 'cat-pose',
    title: 'Cat Pose',
    description: 'A gentle flow to stretch and mobilize the spine.',
    videoFile: 'cat-pose.mp4',
    duration: 45,
    difficulty: 'easy',
    bodyPart: 'back',
    environments: ['home'],
    benefits: ['Stretches back and torso', 'Improves posture', 'Relieves back tension'],
    instructions: [
      'Start on hands and knees in a tabletop position',
      'Inhale, then as you exhale, round your spine toward the ceiling',
      'Drop your head gently, looking toward your navel',
      'Hold for 5 seconds',
      'Inhale, arch your back, lifting your head and tailbone (Cow Pose)',
      'Repeat 5-7 times, flowing between positions'
    ],
    tips: 'Move with your breath for maximum benefit and relaxation.',
    isPremium: false
  },
  {
    id: 'childs-pose',
    title: 'Child\'s Pose',
    description: 'A restful stretch that elongates the spine and relaxes the body.',
    videoFile: 'childs-pose.mp4',
    duration: 45,
    difficulty: 'easy',
    bodyPart: 'back',
    environments: ['home'],
    benefits: ['Relaxes back muscles', 'Stretches hips and thighs', 'Calming effect on mind'],
    instructions: [
      'Kneel on the floor with big toes touching',
      'Sit back on your heels',
      'Separate knees about hip-width apart',
      'Exhale and lay your torso between your thighs',
      'Extend arms forward with palms on floor',
      'Rest forehead on floor',
      'Hold for 30-60 seconds, breathing deeply'
    ],
    tips: 'If this stretch strains your knees, place a folded blanket between your thighs and calves.',
    isPremium: false
  },
  {
    id: 'sphinx',
    title: 'Sphinx Stretch',
    description: 'A gentle backbend that strengthens the spine and opens the chest.',
    videoFile: 'sphinx.mp4',
    duration: 30,
    difficulty: 'moderate',
    bodyPart: 'back',
    environments: ['home'],
    benefits: ['Strengthens lower back', 'Opens chest', 'Improves posture'],
    instructions: [
      'Lie on your stomach with legs extended',
      'Place elbows under shoulders with forearms on floor',
      'Lift upper body, keeping hips and legs on floor',
      'Open chest and look forward',
      'Hold for 15-30 seconds',
      'Slowly lower back down'
    ],
    tips: 'Keep your lower back relaxed. If you feel compression, lower down slightly.',
    isPremium: false
  },
  
  // Premium stretches
  {
    id: 'side-twist',
    title: 'Seated Side Twist',
    description: 'A refreshing twist that helps relieve back tension and improve spinal mobility.',
    videoFile: 'side-twist.mp4',
    duration: 45,
    difficulty: 'moderate',
    bodyPart: 'back',
    environments: ['office', 'home'],
    benefits: ['Releases back tension', 'Improves spinal mobility', 'Stimulates digestion'],
    instructions: [
      'Sit on a chair with feet flat on floor',
      'Place right hand on left knee',
      'Place left hand behind you on chair or seat',
      'Inhale, lengthen spine',
      'Exhale, gently twist to the left',
      'Hold for 15 seconds',
      'Return to center and switch sides'
    ],
    tips: 'Initiate the twist from your abdomen rather than forcing with your arms.',
    isPremium: true
  },
  {
    id: 'wall-squat',
    title: 'Wall Squat',
    description: 'A strengthening and stretching exercise for the legs that uses a wall for support.',
    videoFile: 'wall-squat.mp4',
    duration: 60,
    difficulty: 'moderate',
    bodyPart: 'legs',
    environments: ['office', 'home'],
    benefits: ['Strengthens quadriceps', 'Improves knee stability', 'Engages core'],
    instructions: [
      'Stand with back against wall',
      'Step feet forward about 2 feet from wall',
      'Slide down wall until thighs are parallel to floor',
      'Keep knees above ankles',
      'Hold position for 20-60 seconds',
      'Slide back up'
    ],
    tips: 'If your knees hurt, don\'t slide down as far. Build up gradually.',
    isPremium: true
  },
  {
    id: 'dab-stretch',
    title: 'Dab Stretch',
    description: 'A fun, dynamic stretch that opens the shoulders and engages the core.',
    videoFile: 'dab-stretch.mp4',
    duration: 30,
    difficulty: 'easy',
    bodyPart: 'shoulders',
    environments: ['home'],
    benefits: ['Engages multiple muscle groups', 'Adds fun to your routine', 'Dynamic movement'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Raise right arm up at an angle',
      'Simultaneously bend left arm across body, lowering head',
      'Return to starting position',
      'Repeat on opposite side',
      'Continue alternating for 30 seconds'
    ],
    tips: 'Make it more energetic for a cardio boost or slower for a better stretch.',
    isPremium: true
  },
];

export default stretches;