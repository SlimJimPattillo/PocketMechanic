import { MaintenanceGuide } from '../types';

export const maintenanceGuides: MaintenanceGuide[] = [
  {
    id: '1',
    title: 'How to Check Your Oil Level',
    category: 'oil_change',
    difficulty: 'easy',
    estimatedTime: 10,
    toolsRequired: ['Clean rag or paper towel'],
    partsRequired: [],
    steps: [
      {
        stepNumber: 1,
        title: 'Park on level ground',
        description: 'Make sure your car is parked on level ground and the engine has been off for at least 5 minutes to let oil settle.',
      },
      {
        stepNumber: 2,
        title: 'Locate the dipstick',
        description: 'Pop the hood and find the oil dipstick. It usually has a yellow or orange handle and is labeled "ENGINE OIL".',
      },
      {
        stepNumber: 3,
        title: 'Pull out and wipe',
        description: 'Pull the dipstick all the way out and wipe it clean with a rag. Look for the min/max markings on the end.',
      },
      {
        stepNumber: 4,
        title: 'Reinsert and check',
        description: 'Push the dipstick all the way back in, wait a second, then pull it out again. Check where the oil level sits between the min and max marks.',
      },
      {
        stepNumber: 5,
        title: 'Interpret results',
        description: 'Oil should be between the min and max marks. If it\'s below the min line, add oil. Also check the color - it should be amber or brown, not black.',
      },
    ],
    tips: [
      'Check oil when the engine is cold for the most accurate reading',
      'Check oil level at least once a month',
      'If you need to add oil frequently, you may have a leak',
    ],
    warnings: [
      'Never check oil immediately after running the engine - oil will be too hot',
      'Overfilling oil can damage your engine',
    ],
  },
  {
    id: '2',
    title: 'How to Check Tire Pressure',
    category: 'other',
    difficulty: 'easy',
    estimatedTime: 15,
    toolsRequired: ['Tire pressure gauge', 'Air compressor or access to gas station air pump'],
    partsRequired: [],
    steps: [
      {
        stepNumber: 1,
        title: 'Find recommended PSI',
        description: 'Check the sticker on your driver\'s side door jamb for the recommended tire pressure (PSI). Don\'t use the max PSI listed on the tire itself.',
      },
      {
        stepNumber: 2,
        title: 'Remove valve cap',
        description: 'Unscrew the valve cap from the tire valve stem. Keep it in a safe place so you don\'t lose it.',
      },
      {
        stepNumber: 3,
        title: 'Check pressure',
        description: 'Press the tire gauge firmly onto the valve stem. You\'ll hear a brief hiss of air. The gauge will show the current pressure.',
      },
      {
        stepNumber: 4,
        title: 'Compare to recommended',
        description: 'Compare the reading to the recommended PSI from your door jamb sticker. Tires should be within 2-3 PSI of the recommendation.',
      },
      {
        stepNumber: 5,
        title: 'Add or release air',
        description: 'If pressure is low, add air. If too high, press the small pin in the valve stem to release air. Recheck after adjusting.',
      },
      {
        stepNumber: 6,
        title: 'Repeat for all tires',
        description: 'Check and adjust all four tires plus your spare. Replace valve caps when done.',
      },
    ],
    tips: [
      'Check tire pressure when tires are cold (haven\'t been driven for 3+ hours)',
      'Check monthly and before long trips',
      'Don\'t forget to check your spare tire',
      'Tire pressure can drop 1-2 PSI for every 10°F temperature decrease',
    ],
    warnings: [
      'Never check pressure immediately after driving - heat increases pressure',
    ],
  },
  {
    id: '3',
    title: 'How to Jump Start a Dead Battery',
    category: 'battery',
    difficulty: 'moderate',
    estimatedTime: 15,
    toolsRequired: ['Jumper cables', 'Another vehicle with working battery'],
    partsRequired: [],
    steps: [
      {
        stepNumber: 1,
        title: 'Position vehicles',
        description: 'Park the working vehicle close enough so jumper cables can reach both batteries, but the vehicles should not touch. Both should be in Park (automatic) or Neutral (manual) with parking brakes on.',
      },
      {
        stepNumber: 2,
        title: 'Turn everything off',
        description: 'Turn off both vehicles completely, including lights, radio, and accessories.',
      },
      {
        stepNumber: 3,
        title: 'Connect positive to dead battery',
        description: 'Attach one red clamp to the positive (+) terminal of the dead battery. The positive terminal is usually marked with a + sign and may have a red cover.',
      },
      {
        stepNumber: 4,
        title: 'Connect positive to good battery',
        description: 'Attach the other red clamp to the positive (+) terminal of the working battery.',
      },
      {
        stepNumber: 5,
        title: 'Connect negative to good battery',
        description: 'Attach one black clamp to the negative (-) terminal of the working battery.',
      },
      {
        stepNumber: 6,
        title: 'Connect negative to ground',
        description: 'Attach the other black clamp to an unpainted metal surface on the dead car\'s engine block, away from the battery. This is your ground.',
      },
      {
        stepNumber: 7,
        title: 'Start the working vehicle',
        description: 'Start the working vehicle and let it run for 2-3 minutes.',
      },
      {
        stepNumber: 8,
        title: 'Try starting dead vehicle',
        description: 'Try to start the dead vehicle. If it doesn\'t start after 3-5 seconds, wait a few more minutes and try again.',
      },
      {
        stepNumber: 9,
        title: 'Disconnect cables',
        description: 'Once started, remove cables in reverse order: black from dead car, black from good car, red from good car, red from dead car.',
      },
      {
        stepNumber: 10,
        title: 'Let it run',
        description: 'Let the revived car run for at least 15-20 minutes to recharge the battery. Consider having the battery tested.',
      },
    ],
    tips: [
      'Double-check you\'re connecting positive to positive and negative to ground',
      'Make sure clamps have good metal-to-metal contact',
      'If it doesn\'t start after several attempts, you may need a new battery',
    ],
    warnings: [
      'Never let clamps touch each other once connected to a battery',
      'Keep sparks away from the battery - batteries can produce explosive hydrogen gas',
      'If you see corrosion on battery terminals, clean it first',
      'If battery is cracked, leaking, or frozen, DO NOT jump start it',
    ],
  },
  {
    id: '4',
    title: 'How to Change a Flat Tire',
    category: 'other',
    difficulty: 'moderate',
    estimatedTime: 30,
    toolsRequired: ['Spare tire', 'Car jack', 'Lug wrench', 'Wheel chocks or heavy rocks'],
    partsRequired: [],
    steps: [
      {
        stepNumber: 1,
        title: 'Find a safe location',
        description: 'Pull over to a safe, flat location away from traffic. Turn on hazard lights. Apply parking brake.',
      },
      {
        stepNumber: 2,
        title: 'Get tools and spare',
        description: 'Retrieve your spare tire, jack, and lug wrench from the trunk. Check that spare tire has air.',
      },
      {
        stepNumber: 3,
        title: 'Loosen lug nuts',
        description: 'Remove the hubcap if needed. Use the lug wrench to loosen (but don\'t remove) the lug nuts by turning counter-clockwise. You may need to use your body weight.',
      },
      {
        stepNumber: 4,
        title: 'Position the jack',
        description: 'Place the jack under the car\'s jack point near the flat tire. Consult your owner\'s manual for the exact location - it\'s usually a reinforced notch in the car\'s frame.',
      },
      {
        stepNumber: 5,
        title: 'Raise the vehicle',
        description: 'Raise the jack until the flat tire is about 6 inches off the ground. Make sure the car is stable.',
      },
      {
        stepNumber: 6,
        title: 'Remove lug nuts and tire',
        description: 'Fully remove the lug nuts and place them somewhere safe. Pull the tire straight toward you to remove it.',
      },
      {
        stepNumber: 7,
        title: 'Mount the spare',
        description: 'Align the spare tire with the wheel bolts and push it on. Put the lug nuts back on and tighten them by hand as much as possible.',
      },
      {
        stepNumber: 8,
        title: 'Lower the vehicle',
        description: 'Lower the car until the spare tire just touches the ground but isn\'t bearing the full weight yet.',
      },
      {
        stepNumber: 9,
        title: 'Tighten lug nuts',
        description: 'Tighten the lug nuts in a star pattern (not in a circle). Use your full strength.',
      },
      {
        stepNumber: 10,
        title: 'Lower completely and finish',
        description: 'Lower the car all the way, remove the jack, and give the lug nuts one more firm tightening. Store the flat tire and tools.',
      },
    ],
    tips: [
      'Tighten lug nuts in a star pattern to ensure even pressure',
      'Have your flat tire repaired or replaced as soon as possible',
      'Don\'t drive more than 50 miles on a spare tire',
    ],
    warnings: [
      'Never work under a car supported only by a jack',
      'Don\'t drive fast on a spare tire (max 50 mph)',
      'Some modern cars come with tire repair kits instead of spares',
    ],
  },
  {
    id: '5',
    title: 'How to Replace Windshield Wipers',
    category: 'other',
    difficulty: 'easy',
    estimatedTime: 15,
    toolsRequired: [],
    partsRequired: ['New wiper blades (correct size for your vehicle)'],
    steps: [
      {
        stepNumber: 1,
        title: 'Measure old blades',
        description: 'Check your current wiper blade sizes or look them up in your owner\'s manual. Driver and passenger sides may be different sizes.',
      },
      {
        stepNumber: 2,
        title: 'Purchase correct blades',
        description: 'Buy replacement blades at an auto parts store. Many stores have reference books to help you find the right size.',
      },
      {
        stepNumber: 3,
        title: 'Lift wiper arm',
        description: 'Lift the wiper arm away from the windshield. It should stay up on its own.',
      },
      {
        stepNumber: 4,
        title: 'Remove old blade',
        description: 'Press the small tab on the underside of the wiper where it meets the arm, then slide the blade downward off the hook.',
      },
      {
        stepNumber: 5,
        title: 'Attach new blade',
        description: 'Slide the new blade up onto the arm until you hear or feel it click into place.',
      },
      {
        stepNumber: 6,
        title: 'Lower arm carefully',
        description: 'Gently lower the wiper arm back down to the windshield.',
      },
      {
        stepNumber: 7,
        title: 'Repeat for other side',
        description: 'Repeat the process for the other wiper blade and rear wiper if applicable.',
      },
    ],
    tips: [
      'Replace wiper blades every 6-12 months',
      'Clean your windshield after installing new blades',
      'Some vehicles have different attachment systems - check the instructions that come with new blades',
    ],
    warnings: [
      'Be careful when lowering the arm back down - if it slips, it could crack your windshield',
    ],
  },
];
