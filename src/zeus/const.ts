export const AllTypesProps: Record<string,any> = {
	UserMutation:{
		post:{
			postCreate:{
				type:"PostCreate",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		setUsername:{
			usernameSet:{
				type:"UsernameSet",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	},
	PostCreate:{
		content:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	},
	Query:{
		getUserByUsername:{
			userGet:{
				type:"UserGet",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	},
	Mutation:{
		login:{
			loginInput:{
				type:"LoginInput",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		validate:{
			otpInput:{
				type:"OtpInput",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	},
	UserGet:{
		username:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	},
	LoginInput:{
		phoneNumber:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	},
	OtpInput:{
		phoneNumber:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		code:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	},
	UsernameSet:{
		username:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	}
}

export const ReturnTypes: Record<string,any> = {
	Post:{
		content:"String",
		createdAt:"String"
	},
	User:{
		wall:"Post",
		createdAt:"String",
		username:"String"
	},
	Node:{
		"...on Post": "Post",
		"...on User": "User",
		createdAt:"String"
	},
	UserMutation:{
		post:"String",
		setUsername:"Boolean"
	},
	Query:{
		getUserByUsername:"User",
		me:"User"
	},
	Mutation:{
		userMutation:"UserMutation",
		login:"String",
		validate:"String"
	}
}