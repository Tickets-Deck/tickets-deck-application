/**
 * All countries of the world
 */
const countries = [
  {
    name: "Afghanistan",
    dialCode: "+93",
    emoji: "🇦🇫",
    code: "AF",
  },
  {
    name: "Aland Islands",
    dialCode: "+358",
    emoji: "🇦🇽",
    code: "AX",
  },
  {
    name: "Albania",
    dialCode: "+355",
    emoji: "🇦🇱",
    code: "AL",
  },
  {
    name: "Algeria",
    dialCode: "+213",
    emoji: "🇩🇿",
    code: "DZ",
  },
  {
    name: "AmericanSamoa",
    dialCode: "+1684",
    emoji: "🇦🇸",
    code: "AS",
  },
  {
    name: "Andorra",
    dialCode: "+376",
    emoji: "🇦🇩",
    code: "AD",
  },
  {
    name: "Angola",
    dialCode: "+244",
    emoji: "🇦🇴",
    code: "AO",
  },
  {
    name: "Anguilla",
    dialCode: "+1264",
    emoji: "🇦🇮",
    code: "AI",
  },
  {
    name: "Antarctica",
    dialCode: "+672",
    emoji: "🇦🇶",
    code: "AQ",
  },
  {
    name: "Antigua and Barbuda",
    dialCode: "+1268",
    emoji: "🇦🇬",
    code: "AG",
  },
  {
    name: "Argentina",
    dialCode: "+54",
    emoji: "🇦🇷",
    code: "AR",
  },
  {
    name: "Armenia",
    dialCode: "+374",
    emoji: "🇦🇲",
    code: "AM",
  },
  {
    name: "Aruba",
    dialCode: "+297",
    emoji: "🇦🇼",
    code: "AW",
  },
  {
    name: "Australia",
    dialCode: "+61",
    emoji: "🇦🇺",
    code: "AU",
  },
  {
    name: "Austria",
    dialCode: "+43",
    emoji: "🇦🇹",
    code: "AT",
  },
  {
    name: "Azerbaijan",
    dialCode: "+994",
    emoji: "🇦🇿",
    code: "AZ",
  },
  {
    name: "Bahamas",
    dialCode: "+1242",
    emoji: "🇧🇸",
    code: "BS",
  },
  {
    name: "Bahrain",
    dialCode: "+973",
    emoji: "🇧🇭",
    code: "BH",
  },
  {
    name: "Bangladesh",
    dialCode: "+880",
    emoji: "🇧🇩",
    code: "BD",
  },
  {
    name: "Barbados",
    dialCode: "+1246",
    emoji: "🇧🇧",
    code: "BB",
  },
  {
    name: "Belarus",
    dialCode: "+375",
    emoji: "🇧🇾",
    code: "BY",
  },
  {
    name: "Belgium",
    dialCode: "+32",
    emoji: "🇧🇪",
    code: "BE",
  },
  {
    name: "Belize",
    dialCode: "+501",
    emoji: "🇧🇿",
    code: "BZ",
  },
  {
    name: "Benin",
    dialCode: "+229",
    emoji: "🇧🇯",
    code: "BJ",
  },
  {
    name: "Bermuda",
    dialCode: "+1441",
    emoji: "🇧🇲",
    code: "BM",
  },
  {
    name: "Bhutan",
    dialCode: "+975",
    emoji: "🇧🇹",
    code: "BT",
  },
  {
    name: "Bolivia, Plurinational State of",
    dialCode: "+591",
    emoji: "🇧🇴",
    code: "BO",
  },
  {
    name: "Bosnia and Herzegovina",
    dialCode: "+387",
    emoji: "🇧🇦",
    code: "BA",
  },
  {
    name: "Botswana",
    dialCode: "+267",
    emoji: "🇧🇼",
    code: "BW",
  },
  {
    name: "Brazil",
    dialCode: "+55",
    emoji: "🇧🇷",
    code: "BR",
  },
  {
    name: "British Indian Ocean Territory",
    dialCode: "+246",
    emoji: "🇮🇴",
    code: "IO",
  },
  {
    name: "Brunei Darussalam",
    dialCode: "+673",
    emoji: "🇧🇳",
    code: "BN",
  },
  {
    name: "Bulgaria",
    dialCode: "+359",
    emoji: "🇧🇬",
    code: "BG",
  },
  {
    name: "Burkina Faso",
    dialCode: "+226",
    emoji: "🇧🇫",
    code: "BF",
  },
  {
    name: "Burundi",
    dialCode: "+257",
    emoji: "🇧🇮",
    code: "BI",
  },
  {
    name: "Cambodia",
    dialCode: "+855",
    emoji: "🇰🇭",
    code: "KH",
  },
  {
    name: "Cameroon",
    dialCode: "+237",
    emoji: "🇨🇲",
    code: "CM",
  },
  {
    name: "Canada",
    dialCode: "+1",
    emoji: "🇨🇦",
    code: "CA",
  },
  {
    name: "Cape Verde",
    dialCode: "+238",
    emoji: "🇨🇻",
    code: "CV",
  },
  {
    name: "Cayman Islands",
    dialCode: "+345",
    emoji: "🇰🇾",
    code: "KY",
  },
  {
    name: "Central African Republic",
    dialCode: "+236",
    emoji: "🇨🇫",
    code: "CF",
  },
  {
    name: "Chad",
    dialCode: "+235",
    emoji: "🇹🇩",
    code: "TD",
  },
  {
    name: "Chile",
    dialCode: "+56",
    emoji: "🇨🇱",
    code: "CL",
  },
  {
    name: "China",
    dialCode: "+86",
    emoji: "🇨🇳",
    code: "CN",
  },
  {
    name: "Christmas Island",
    dialCode: "+61",
    emoji: "🇨🇽",
    code: "CX",
  },
  {
    name: "Cocos (Keeling) Islands",
    dialCode: "+61",
    emoji: "🇨🇨",
    code: "CC",
  },
  {
    name: "Colombia",
    dialCode: "+57",
    emoji: "🇨🇴",
    code: "CO",
  },
  {
    name: "Comoros",
    dialCode: "+269",
    emoji: "🇰🇲",
    code: "KM",
  },
  {
    name: "Congo",
    dialCode: "+242",
    emoji: "🇨🇬",
    code: "CG",
  },
  {
    name: "Congo, The Democratic Republic of the Congo",
    dialCode: "+243",
    emoji: "🇨🇩",
    code: "CD",
  },
  {
    name: "Cook Islands",
    dialCode: "+682",
    emoji: "🇨🇰",
    code: "CK",
  },
  {
    name: "Costa Rica",
    dialCode: "+506",
    emoji: "🇨🇷",
    code: "CR",
  },
  {
    name: "Cote d'Ivoire",
    dialCode: "+225",
    emoji: "🇨🇮",
    code: "CI",
  },
  {
    name: "Croatia",
    dialCode: "+385",
    emoji: "🇭🇷",
    code: "HR",
  },
  {
    name: "Cuba",
    dialCode: "+53",
    emoji: "🇨🇺",
    code: "CU",
  },
  {
    name: "Cyprus",
    dialCode: "+357",
    emoji: "🇨🇾",
    code: "CY",
  },
  {
    name: "Czech Republic",
    dialCode: "+420",
    emoji: "🇨🇿",
    code: "CZ",
  },
  {
    name: "Denmark",
    dialCode: "+45",
    emoji: "🇩🇰",
    code: "DK",
  },
  {
    name: "Djibouti",
    dialCode: "+253",
    emoji: "🇩🇯",
    code: "DJ",
  },
  {
    name: "Dominica",
    dialCode: "+1767",
    emoji: "🇩🇲",
    code: "DM",
  },
  {
    name: "Dominican Republic",
    dialCode: "+1849",
    emoji: "🇩🇴",
    code: "DO",
  },
  {
    name: "Ecuador",
    dialCode: "+593",
    emoji: "🇪🇨",
    code: "EC",
  },
  {
    name: "Egypt",
    dialCode: "+20",
    emoji: "🇪🇬",
    code: "EG",
  },
  {
    name: "El Salvador",
    dialCode: "+503",
    emoji: "🇸🇻",
    code: "SV",
  },
  {
    name: "Equatorial Guinea",
    dialCode: "+240",
    emoji: "🇬🇶",
    code: "GQ",
  },
  {
    name: "Eritrea",
    dialCode: "+291",
    emoji: "🇪🇷",
    code: "ER",
  },
  {
    name: "Estonia",
    dialCode: "+372",
    emoji: "🇪🇪",
    code: "EE",
  },
  {
    name: "Ethiopia",
    dialCode: "+251",
    emoji: "🇪🇹",
    code: "ET",
  },
  {
    name: "Falkland Islands (Malvinas)",
    dialCode: "+500",
    emoji: "🇫🇰",
    code: "FK",
  },
  {
    name: "Faroe Islands",
    dialCode: "+298",
    emoji: "🇫🇴",
    code: "FO",
  },
  {
    name: "Fiji",
    dialCode: "+679",
    emoji: "🇫🇯",
    code: "FJ",
  },
  {
    name: "Finland",
    dialCode: "+358",
    emoji: "🇫🇮",
    code: "FI",
  },
  {
    name: "France",
    dialCode: "+33",
    emoji: "🇫🇷",
    code: "FR",
  },
  {
    name: "French Guiana",
    dialCode: "+594",
    emoji: "🇬🇫",
    code: "GF",
  },
  {
    name: "French Polynesia",
    dialCode: "+689",
    emoji: "🇵🇫",
    code: "PF",
  },
  {
    name: "Gabon",
    dialCode: "+241",
    emoji: "🇬🇦",
    code: "GA",
  },
  {
    name: "Gambia",
    dialCode: "+220",
    emoji: "🇬🇲",
    code: "GM",
  },
  {
    name: "Georgia",
    dialCode: "+995",
    emoji: "🇬🇪",
    code: "GE",
  },
  {
    name: "Germany",
    dialCode: "+49",
    emoji: "🇩🇪",
    code: "DE",
  },
  {
    name: "Ghana",
    dialCode: "+233",
    emoji: "🇬🇭",
    code: "GH",
  },
  {
    name: "Gibraltar",
    dialCode: "+350",
    emoji: "🇬🇮",
    code: "GI",
  },
  {
    name: "Greece",
    dialCode: "+30",
    emoji: "🇬🇷",
    code: "GR",
  },
  {
    name: "Greenland",
    dialCode: "+299",
    emoji: "🇬🇱",
    code: "GL",
  },
  {
    name: "Grenada",
    dialCode: "+1473",
    emoji: "🇬🇩",
    code: "GD",
  },
  {
    name: "Guadeloupe",
    dialCode: "+590",
    emoji: "🇬🇵",
    code: "GP",
  },
  {
    name: "Guam",
    dialCode: "+1671",
    emoji: "🇬🇺",
    code: "GU",
  },
  {
    name: "Guatemala",
    dialCode: "+502",
    emoji: "🇬🇹",
    code: "GT",
  },
  {
    name: "Guernsey",
    dialCode: "+44",
    emoji: "🇬🇬",
    code: "GG",
  },
  {
    name: "Guinea",
    dialCode: "+224",
    emoji: "🇬🇳",
    code: "GN",
  },
  {
    name: "Guinea-Bissau",
    dialCode: "+245",
    emoji: "🇬🇼",
    code: "GW",
  },
  {
    name: "Guyana",
    dialCode: "+595",
    emoji: "🇬🇾",
    code: "GY",
  },
  {
    name: "Haiti",
    dialCode: "+509",
    emoji: "🇭🇹",
    code: "HT",
  },
  {
    name: "Holy See (Vatican City State)",
    dialCode: "+379",
    emoji: "🇻🇦",
    code: "VA",
  },
  {
    name: "Honduras",
    dialCode: "+504",
    emoji: "🇭🇳",
    code: "HN",
  },
  {
    name: "Hong Kong",
    dialCode: "+852",
    emoji: "🇭🇰",
    code: "HK",
  },
  {
    name: "Hungary",
    dialCode: "+36",
    emoji: "🇭🇺",
    code: "HU",
  },
  {
    name: "Iceland",
    dialCode: "+354",
    emoji: "🇮🇸",
    code: "IS",
  },
  {
    name: "India",
    dialCode: "+91",
    emoji: "🇮🇳",
    code: "IN",
  },
  {
    name: "Indonesia",
    dialCode: "+62",
    emoji: "🇮🇩",
    code: "ID",
  },
  {
    name: "Iran, Islamic Republic of Persian Gulf",
    dialCode: "+98",
    emoji: "🇮🇷",
    code: "IR",
  },
  {
    name: "Iraq",
    dialCode: "+964",
    emoji: "🇮🇷",
    code: "IQ",
  },
  {
    name: "Ireland",
    dialCode: "+353",
    emoji: "🇮🇪",
    code: "IE",
  },
  {
    name: "Isle of Man",
    dialCode: "+44",
    emoji: "🇮🇲",
    code: "IM",
  },
  {
    name: "Israel",
    dialCode: "+972",
    emoji: "🇮🇱",
    code: "IL",
  },
  {
    name: "Italy",
    dialCode: "+39",
    emoji: "🇮🇹",
    code: "IT",
  },
  {
    name: "Jamaica",
    dialCode: "+1876",
    emoji: "🇯🇲",
    code: "JM",
  },
  {
    name: "Japan",
    dialCode: "+81",
    emoji: "🇯🇵",
    code: "JP",
  },
  {
    name: "Jersey",
    dialCode: "+44",
    emoji: "🇯🇪",
    code: "JE",
  },
  {
    name: "Jordan",
    dialCode: "+962",
    emoji: "🇯🇴",
    code: "JO",
  },
  {
    name: "Kazakhstan",
    dialCode: "+77",
    emoji: "🇰🇿",
    code: "KZ",
  },
  {
    name: "Kenya",
    dialCode: "+254",
    emoji: "🇰🇪",
    code: "KE",
  },
  {
    name: "Kiribati",
    dialCode: "+686",
    emoji: "🇰🇮",
    code: "KI",
  },
  {
    name: "Korea, Democratic People's Republic of Korea",
    dialCode: "+850",
    emoji: "🇰🇵",
    code: "KP",
  },
  {
    name: "Korea, Republic of South Korea",
    dialCode: "+82",
    emoji: "🇰🇷",
    code: "KR",
  },
  {
    name: "Kuwait",
    dialCode: "+965",
    emoji: "🇰🇼",
    code: "KW",
  },
  {
    name: "Kyrgyzstan",
    dialCode: "+996",
    emoji: "🇰🇬",
    code: "KG",
  },
  {
    name: "Laos",
    dialCode: "+856",
    emoji: "🇱🇦",
    code: "LA",
  },
  {
    name: "Latvia",
    dialCode: "+371",
    emoji: "🇱🇻",
    code: "LV",
  },
  {
    name: "Lebanon",
    dialCode: "+961",
    emoji: "🇱🇧",
    code: "LB",
  },
  {
    name: "Lesotho",
    dialCode: "+266",
    emoji: "🇱🇸",
    code: "LS",
  },
  {
    name: "Liberia",
    dialCode: "+231",
    emoji: "🇱🇷",
    code: "LR",
  },
  {
    name: "Libyan Arab Jamahiriya",
    dialCode: "+218",
    emoji: "🇱🇾",
    code: "LY",
  },
  {
    name: "Liechtenstein",
    dialCode: "+423",
    emoji: "🇱🇮",
    code: "LI",
  },
  {
    name: "Lithuania",
    dialCode: "+370",
    emoji: "🇱🇹",
    code: "LT",
  },
  {
    name: "Luxembourg",
    dialCode: "+352",
    emoji: "🇱🇺",
    code: "LU",
  },
  {
    name: "Macao",
    dialCode: "+853",
    emoji: "🇲🇴",
    code: "MO",
  },
  {
    name: "Macedonia",
    dialCode: "+389",
    emoji: "🇲🇰",
    code: "MK",
  },
  {
    name: "Madagascar",
    dialCode: "+261",
    emoji: "🇲🇬",
    code: "MG",
  },
  {
    name: "Malawi",
    dialCode: "+265",
    emoji: "🇲🇼",
    code: "MW",
  },
  {
    name: "Malaysia",
    dialCode: "+60",
    emoji: "🇲🇾",
    code: "MY",
  },
  {
    name: "Maldives",
    dialCode: "+960",
    emoji: "🇲🇻",
    code: "MV",
  },
  {
    name: "Mali",
    dialCode: "+223",
    emoji: "🇲🇱",
    code: "ML",
  },
  {
    name: "Malta",
    dialCode: "+356",
    emoji: "🇲🇹",
    code: "MT",
  },
  {
    name: "Marshall Islands",
    dialCode: "+692",
    emoji: "🇲🇭",
    code: "MH",
  },
  {
    name: "Martinique",
    dialCode: "+596",
    emoji: "🇲🇶",
    code: "MQ",
  },
  {
    name: "Mauritania",
    dialCode: "+222",
    emoji: "🇲🇷",
    code: "MR",
  },
  {
    name: "Mauritius",
    dialCode: "+230",
    emoji: "🇲🇺",
    code: "MU",
  },
  {
    name: "Mayotte",
    dialCode: "+262",
    emoji: "🇾🇹",
    code: "YT",
  },
  {
    name: "Mexico",
    dialCode: "+52",
    emoji: "🇲🇽",
    code: "MX",
  },
  {
    name: "Micronesia, Federated States of Micronesia",
    dialCode: "+691",
    emoji: "🇫🇲",
    code: "FM",
  },
  {
    name: "Moldova",
    dialCode: "+373",
    emoji: "🇲🇩",
    code: "MD",
  },
  {
    name: "Monaco",
    dialCode: "+377",
    emoji: "🇲🇨",
    code: "MC",
  },
  {
    name: "Mongolia",
    dialCode: "+976",
    emoji: "🇲🇳",
    code: "MN",
  },
  {
    name: "Montenegro",
    dialCode: "+382",
    emoji: "🇲🇪",
    code: "ME",
  },
  {
    name: "Montserrat",
    dialCode: "+1664",
    emoji: "🇲🇸",
    code: "MS",
  },
  {
    name: "Morocco",
    dialCode: "+212",
    emoji: "🇲🇦",
    code: "MA",
  },
  {
    name: "Mozambique",
    dialCode: "+258",
    emoji: "🇲🇿",
    code: "MZ",
  },
  {
    name: "Myanmar",
    dialCode: "+95",
    emoji: "🇲🇲",
    code: "MM",
  },
  {
    name: "Namibia",
    emoji: "🇳🇦",
    dialCode: "+264",
    code: "NA",
  },
  {
    name: "Nauru",
    dialCode: "+674",
    emoji: "🇳🇷",
    code: "NR",
  },
  {
    name: "Nepal",
    dialCode: "+977",
    emoji: "🇳🇵",
    code: "NP",
  },
  {
    name: "Netherlands",
    dialCode: "+31",
    emoji: "🇳🇱",
    code: "NL",
  },
  {
    name: "Netherlands Antilles",
    dialCode: "+599",
    emoji: "🇧🇶",
    code: "AN",
  },
  {
    name: "New Caledonia",
    dialCode: "+687",
    emoji: "🇳🇨",
    code: "NC",
  },
  {
    name: "New Zealand",
    dialCode: "+64",
    emoji: "🇳🇿",
    code: "NZ",
  },
  {
    name: "Nicaragua",
    dialCode: "+505",
    emoji: "🇳🇮",
    code: "NI",
  },
  {
    name: "Niger",
    dialCode: "+227",
    emoji: "🇳🇪",
    code: "NE",
  },
  {
    name: "Nigeria",
    dialCode: "+234",
    emoji: "🇳🇬",
    code: "NG",
  },
  {
    name: "Niue",
    dialCode: "+683",
    emoji: "🇳🇺",
    code: "NU",
  },
  {
    name: "Norfolk Island",
    dialCode: "+672",
    emoji: "🇳🇫",
    code: "NF",
  },
  {
    name: "Northern Mariana Islands",
    dialCode: "+1670",
    emoji: "🇲🇵",
    code: "MP",
  },
  {
    name: "Norway",
    dialCode: "+47",
    emoji: "🇳🇴",
    code: "NO",
  },
  {
    name: "Oman",
    dialCode: "+968",
    emoji: "🇴🇲",
    code: "OM",
  },
  {
    name: "Pakistan",
    dialCode: "+92",
    emoji: "🇵🇰",
    code: "PK",
  },
  {
    name: "Palau",
    dialCode: "+680",
    emoji: "🇵🇼",
    code: "PW",
  },
  {
    name: "Palestinian Territory, Occupied",
    dialCode: "+970",
    emoji: "🇵🇸",
    code: "PS",
  },
  {
    name: "Panama",
    dialCode: "+507",
    emoji: "🇵🇦",
    code: "PA",
  },
  {
    name: "Papua New Guinea",
    dialCode: "+675",
    emoji: "🇵🇬",
    code: "PG",
  },
  {
    name: "Paraguay",
    dialCode: "+595",
    emoji: "🇵🇾",
    code: "PY",
  },
  {
    name: "Peru",
    dialCode: "+51",
    emoji: "🇵🇪",
    code: "PE",
  },
  {
    name: "Philippines",
    dialCode: "+63",
    emoji: "🇵🇭",
    code: "PH",
  },
  {
    name: "Pitcairn",
    dialCode: "+872",
    emoji: "🇵🇳",
    code: "PN",
  },
  {
    name: "Poland",
    dialCode: "+48",
    emoji: "🇵🇱",
    code: "PL",
  },
  {
    name: "Portugal",
    dialCode: "+351",
    emoji: "🇵🇹",
    code: "PT",
  },
  {
    name: "Puerto Rico",
    dialCode: "+1939",
    emoji: "🇵🇷",
    code: "PR",
  },
  {
    name: "Qatar",
    dialCode: "+974",
    emoji: "🇶🇦",
    code: "QA",
  },
  {
    name: "Romania",
    dialCode: "+40",
    emoji: "🇷🇴",
    code: "RO",
  },
  {
    name: "Russia",
    dialCode: "+7",
    emoji: "🇷🇺",
    code: "RU",
  },
  {
    name: "Rwanda",
    dialCode: "+250",
    emoji: "🇷🇼",
    code: "RW",
  },
  {
    name: "Reunion",
    dialCode: "+262",
    emoji: "🇷🇪",
    code: "RE",
  },
  {
    name: "Saint Barthelemy",
    dialCode: "+590",
    emoji: "🇧🇱",
    code: "BL",
  },
  {
    name: "Saint Helena, Ascension and Tristan Da Cunha",
    dialCode: "+290",
    emoji: "🇸🇭",
    code: "SH",
  },
  {
    name: "Saint Kitts and Nevis",
    dialCode: "+1869",
    emoji: "🇰🇳",
    code: "KN",
  },
  {
    name: "Saint Lucia",
    dialCode: "+1758",
    emoji: "🇱🇨",
    code: "LC",
  },
  {
    name: "Saint Martin",
    dialCode: "+590",
    emoji: "🇲🇫",
    code: "MF",
  },
  {
    name: "Saint Pierre and Miquelon",
    dialCode: "+508",
    emoji: "🇵🇲",
    code: "PM",
  },
  {
    name: "Saint Vincent and the Grenadines",
    dialCode: "+1784",
    emoji: "🇻🇨",
    code: "VC",
  },
  {
    name: "Samoa",
    dialCode: "+685",
    emoji: "🇼🇸",
    code: "WS",
  },
  {
    name: "San Marino",
    dialCode: "+378",
    emoji: "🇸🇲",
    code: "SM",
  },
  {
    name: "Sao Tome and Principe",
    dialCode: "+239",
    emoji: "🇸🇹",
    code: "ST",
  },
  {
    name: "Saudi Arabia",
    dialCode: "+966",
    emoji: "🇸🇦",
    code: "SA",
  },
  {
    name: "Senegal",
    dialCode: "+221",
    emoji: "🇸🇳",
    code: "SN",
  },
  {
    name: "Serbia",
    dialCode: "+381",
    emoji: "🇷🇸",
    code: "RS",
  },
  {
    name: "Seychelles",
    dialCode: "+248",
    emoji: "🇸🇨",
    code: "SC",
  },
  {
    name: "Sierra Leone",
    dialCode: "+232",
    emoji: "🇸🇱",
    code: "SL",
  },
  {
    name: "Singapore",
    dialCode: "+65",
    emoji: "🇸🇬",
    code: "SG",
  },
  {
    name: "Slovakia",
    dialCode: "+421",
    emoji: "🇸🇰",
    code: "SK",
  },
  {
    name: "Slovenia",
    dialCode: "+386",
    emoji: "🇸🇮",
    code: "SI",
  },
  {
    name: "Solomon Islands",
    dialCode: "+677",
    emoji: "🇸🇧",
    code: "SB",
  },
  {
    name: "Somalia",
    dialCode: "+252",
    emoji: "🇸🇴",
    code: "SO",
  },
  {
    name: "South Africa",
    dialCode: "+27",
    emoji: "🇿🇦",
    code: "ZA",
  },
  {
    name: "South Sudan",
    dialCode: "+211",
    emoji: "🇸🇸",
    code: "SS",
  },
  {
    name: "South Georgia and the South Sandwich Islands",
    dialCode: "+500",
    emoji: "🇬🇸",
    code: "GS",
  },
  {
    name: "Spain",
    dialCode: "+34",
    emoji: "🇪🇸",
    code: "ES",
  },
  {
    name: "Sri Lanka",
    dialCode: "+94",
    emoji: "🇱🇰",
    code: "LK",
  },
  {
    name: "Sudan",
    dialCode: "+249",
    emoji: "🇸🇩",
    code: "SD",
  },
  {
    name: "Suriname",
    dialCode: "+597",
    emoji: "🇸🇷",
    code: "SR",
  },
  {
    name: "Svalbard and Jan Mayen",
    dialCode: "+47",
    emoji: "🇸🇯",
    code: "SJ",
  },
  {
    name: "Swaziland",
    dialCode: "+268",
    emoji: "🇸🇿",
    code: "SZ",
  },
  {
    name: "Sweden",
    dialCode: "+46",
    emoji: "🇸🇪",
    code: "SE",
  },
  {
    name: "Switzerland",
    dialCode: "+41",
    emoji: "🇨🇭",
    code: "CH",
  },
  {
    name: "Syrian Arab Republic",
    dialCode: "+963",
    emoji: "🇸🇾",
    code: "SY",
  },
  {
    name: "Taiwan",
    dialCode: "+886",
    emoji: "🇹🇼",
    code: "TW",
  },
  {
    name: "Tajikistan",
    dialCode: "+992",
    emoji: "🇹🇯",
    code: "TJ",
  },
  {
    name: "Tanzania, United Republic of Tanzania",
    dialCode: "+255",
    emoji: "🇹🇿",
    code: "TZ",
  },
  {
    name: "Thailand",
    dialCode: "+66",
    emoji: "🇹🇭",
    code: "TH",
  },
  {
    name: "Timor-Leste",
    dialCode: "+670",
    emoji: "🇹🇱",
    code: "TL",
  },
  {
    name: "Togo",
    dialCode: "+228",
    emoji: "🇹🇬",
    code: "TG",
  },
  {
    name: "Tokelau",
    dialCode: "+690",
    emoji: "🇹🇰",
    code: "TK",
  },
  {
    name: "Tonga",
    dialCode: "+676",
    emoji: "🇹🇴",
    code: "TO",
  },
  {
    name: "Trinidad and Tobago",
    dialCode: "+1868",
    emoji: "🇹🇹",
    code: "TT",
  },
  {
    name: "Tunisia",
    dialCode: "+216",
    emoji: "🇹🇳",
    code: "TN",
  },
  {
    name: "Turkey",
    dialCode: "+90",
    emoji: "🇹🇷",
    code: "TR",
  },
  {
    name: "Turkmenistan",
    dialCode: "+993",
    emoji: "🇹🇲",
    code: "TM",
  },
  {
    name: "Turks and Caicos Islands",
    dialCode: "+1649",
    emoji: "🇹🇨",
    code: "TC",
  },
  {
    name: "Tuvalu",
    dialCode: "+688",
    emoji: "🇹🇻",
    code: "TV",
  },
  {
    name: "Uganda",
    dialCode: "+256",
    emoji: "🇺🇬",
    code: "UG",
  },
  {
    name: "Ukraine",
    dialCode: "+380",
    emoji: "🇺🇦",
    code: "UA",
  },
  {
    name: "United Arab Emirates",
    dialCode: "+971",
    emoji: "🇦🇪",
    code: "AE",
  },
  {
    name: "United Kingdom",
    dialCode: "+44",
    emoji: "🇬🇧",
    code: "GB",
  },
  {
    name: "United States",
    dialCode: "+1",
    emoji: "🇺🇸",
    code: "US",
  },
  {
    name: "Uruguay",
    dialCode: "+598",
    emoji: "🇺🇾",
    code: "UY",
  },
  {
    name: "Uzbekistan",
    dialCode: "+998",
    emoji: "🇺🇿",
    code: "UZ",
  },
  {
    name: "Vanuatu",
    dialCode: "+678",
    emoji: "🇻🇺",
    code: "VU",
  },
  {
    name: "Venezuela, Bolivarian Republic of Venezuela",
    dialCode: "+58",
    emoji: "🇻🇪",
    code: "VE",
  },
  {
    name: "Vietnam",
    dialCode: "+84",
    emoji: "🇻🇳",
    code: "VN",
  },
  {
    name: "Virgin Islands, British",
    dialCode: "+1284",
    emoji: "🇻🇬",
    code: "VG",
  },
  {
    name: "Virgin Islands, U.S.",
    dialCode: "+1340",
    emoji: "🇻🇮",
    code: "VI",
  },
  {
    name: "Wallis and Futuna",
    dialCode: "+681",
    emoji: "🇼🇫",
    code: "WF",
  },
  {
    name: "Yemen",
    dialCode: "+967",
    emoji: "🇾🇪",
    code: "YE",
  },
  {
    name: "Zambia",
    dialCode: "+260",
    emoji: "🇿🇲",
    code: "ZM",
  },
  {
    name: "Zimbabwe",
    dialCode: "+263",
    emoji: "🇿🇼",
    code: "ZW",
  },
];

export default countries;