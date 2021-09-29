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
		uploadFiles:{
			files:{
				type:"FileInput",
				array:true,
				arrayRequired:true,
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
		},
		files:{
			type:"FilePostInput",
			array:true,
			arrayRequired:false,
			required:true
		}
	},
	FilePostInput:{
		getUrl:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		type:{
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
		},
		username:{
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
	FileInput:{
		name:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		type:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	}
}

export const ReturnTypes: Record<string,any> = {
	Post:{
		content:"Content",
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
		uploadFiles:"UploadRequestResponse"
	},
	Query:{
		getUserByUsername:"User",
		me:"User"
	},
	Mutation:{
		userMutation:"UserMutation",
		login:"String",
		validate:"String"
	},
	UploadRequestResponse:{
		getUrl:"String",
		putUrl:"String"
	},
	Content:{
		content:"String",
		files:"File"
	},
	File:{
		getUrl:"String",
		type:"String"
	}
}